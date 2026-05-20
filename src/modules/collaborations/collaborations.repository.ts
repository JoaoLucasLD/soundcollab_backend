import { Injectable } from '@nestjs/common';
import {
  Collaboration,
  CollaborationStatus,
  Instrument,
  Prisma,
  Profile,
  Style,
  User,
} from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

type CreateCollaborationParams = {
  requesterId: string;
  receiverId: string;
};

type ListCollaborationsFilters = {
  userId: string;
  skip: number;
  take: number;
  status?: CollaborationStatus;
};

type ListCollaborationsResult = {
  items: CollaborationWithParticipants[];
  total: number;
};

export type CollaborationWithParticipants = Collaboration & {
  requester: User & {
    profile:
      | (Profile & {
          instruments: Instrument[];
          styles: Style[];
        })
      | null;
  };
  receiver: User & {
    profile:
      | (Profile & {
          instruments: Instrument[];
          styles: Style[];
        })
      | null;
  };
};

@Injectable()
export class CollaborationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findProfileByUserId(userId: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({
      where: { userId },
    });
  }

  findPendingBetweenUsers(
    requesterId: string,
    receiverId: string,
  ): Promise<Collaboration | null> {
    return this.prisma.collaboration.findFirst({
      where: {
        status: CollaborationStatus.PENDING,
        OR: [
          {
            requesterId,
            receiverId,
          },
          {
            requesterId: receiverId,
            receiverId: requesterId,
          },
        ],
      },
    });
  }

  create(params: CreateCollaborationParams): Promise<CollaborationWithParticipants> {
    return this.prisma.collaboration.create({
      data: {
        requesterId: params.requesterId,
        receiverId: params.receiverId,
      },
      include: collaborationParticipantsInclude,
    });
  }

  findById(
    collaborationId: string,
  ): Promise<CollaborationWithParticipants | null> {
    return this.prisma.collaboration.findUnique({
      where: { id: collaborationId },
      include: collaborationParticipantsInclude,
    });
  }

  updateStatus(
    collaborationId: string,
    status: CollaborationStatus,
  ): Promise<CollaborationWithParticipants> {
    return this.prisma.collaboration.update({
      where: { id: collaborationId },
      data: { status },
      include: collaborationParticipantsInclude,
    });
  }

  async findByUserWithFilters(
    filters: ListCollaborationsFilters,
  ): Promise<ListCollaborationsResult> {
    const where: Prisma.CollaborationWhereInput = {
      OR: [{ requesterId: filters.userId }, { receiverId: filters.userId }],
    };

    if (filters.status) {
      where.status = filters.status;
    }

    const [items, total] = await Promise.all([
      this.prisma.collaboration.findMany({
        where,
        include: collaborationParticipantsInclude,
        orderBy: {
          createdAt: 'desc',
        },
        skip: filters.skip,
        take: filters.take,
      }),
      this.prisma.collaboration.count({
        where,
      }),
    ]);

    return {
      items,
      total,
    };
  }
}

const collaborationParticipantsInclude = {
  requester: {
    include: {
      profile: {
        include: {
          instruments: true,
          styles: true,
        },
      },
    },
  },
  receiver: {
    include: {
      profile: {
        include: {
          instruments: true,
          styles: true,
        },
      },
    },
  },
} satisfies Prisma.CollaborationInclude;
