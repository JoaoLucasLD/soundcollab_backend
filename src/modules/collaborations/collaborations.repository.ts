import { Injectable } from '@nestjs/common';
import { Collaboration, CollaborationStatus, Profile } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

type CreateCollaborationParams = {
  requesterId: string;
  receiverId: string;
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

  create(params: CreateCollaborationParams): Promise<Collaboration> {
    return this.prisma.collaboration.create({
      data: {
        requesterId: params.requesterId,
        receiverId: params.receiverId,
      },
    });
  }

  findById(collaborationId: string): Promise<Collaboration | null> {
    return this.prisma.collaboration.findUnique({
      where: { id: collaborationId },
    });
  }

  updateStatus(
    collaborationId: string,
    status: CollaborationStatus,
  ): Promise<Collaboration> {
    return this.prisma.collaboration.update({
      where: { id: collaborationId },
      data: { status },
    });
  }
}
