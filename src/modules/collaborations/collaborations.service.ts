import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CollaborationStatus, Profile } from '@prisma/client';
import {
  CollaborationsRepository,
  CollaborationWithParticipants,
} from './collaborations.repository';
import {
  CollaborationProfileSummaryDto,
  CollaborationResponseDto,
} from './dto/collaboration-response.dto';
import { CreateCollaborationDto } from './dto/create-collaboration.dto';
import { ListCollaborationsQueryDto } from './dto/list-collaborations-query.dto';
import { ListCollaborationsResponseDto } from './dto/list-collaborations-response.dto';

@Injectable()
export class CollaborationsService {
  constructor(
    private readonly collaborationsRepository: CollaborationsRepository,
  ) {}

  async create(
    requesterId: string,
    input: CreateCollaborationDto,
  ): Promise<CollaborationResponseDto> {
    const receiverId = this.normalizeUserId(input.receiverId);
    if (receiverId === requesterId) {
      throw new BadRequestException(
        'Cannot create collaboration request for yourself',
      );
    }

    await this.ensureProfilesExist(requesterId, receiverId);

    const existingPending =
      await this.collaborationsRepository.findPendingBetweenUsers(
        requesterId,
        receiverId,
      );
    if (existingPending) {
      throw new ConflictException('Pending collaboration already exists');
    }

    const created = await this.collaborationsRepository.create({
      requesterId,
      receiverId,
    });

    return this.toResponse(created, requesterId);
  }

  accept(
    receiverId: string,
    collaborationId: string,
  ): Promise<CollaborationResponseDto> {
    return this.updateStatus(
      receiverId,
      collaborationId,
      CollaborationStatus.ACCEPTED,
    );
  }

  reject(
    receiverId: string,
    collaborationId: string,
  ): Promise<CollaborationResponseDto> {
    return this.updateStatus(
      receiverId,
      collaborationId,
      CollaborationStatus.REJECTED,
    );
  }

  async listForUser(
    userId: string,
    query: ListCollaborationsQueryDto,
  ): Promise<ListCollaborationsResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const { items, total } =
      await this.collaborationsRepository.findByUserWithFilters({
        userId,
        skip,
        take: limit,
        status: query.status,
      });

    return {
      items: items.map((item) => this.toResponse(item, userId)),
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  private async updateStatus(
    receiverId: string,
    collaborationId: string,
    nextStatus: CollaborationStatus,
  ): Promise<CollaborationResponseDto> {
    const collaboration =
      await this.collaborationsRepository.findById(collaborationId);
    if (!collaboration) {
      throw new NotFoundException('Collaboration not found');
    }

    if (collaboration.receiverId !== receiverId) {
      throw new ForbiddenException(
        'Only the receiver can update this collaboration',
      );
    }

    if (collaboration.status !== CollaborationStatus.PENDING) {
      throw new ConflictException('Collaboration is not pending');
    }

    const updated = await this.collaborationsRepository.updateStatus(
      collaborationId,
      nextStatus,
    );
    return this.toResponse(updated, receiverId);
  }

  private async ensureProfilesExist(
    requesterId: string,
    receiverId: string,
  ): Promise<void> {
    const requesterProfile =
      await this.collaborationsRepository.findProfileByUserId(requesterId);
    if (!requesterProfile) {
      throw new NotFoundException('Profile not found');
    }

    const receiverProfile =
      await this.collaborationsRepository.findProfileByUserId(receiverId);
    if (!receiverProfile) {
      throw new NotFoundException('Receiver profile not found');
    }
  }

  private normalizeUserId(userId: string): string {
    const normalized = userId.trim();
    if (normalized.length === 0) {
      throw new BadRequestException('receiverId cannot be empty');
    }

    return normalized;
  }

  private toResponse(
    model: CollaborationWithParticipants,
    currentUserId: string,
  ): CollaborationResponseDto {
    return {
      id: model.id,
      requesterId: model.requesterId,
      receiverId: model.receiverId,
      matchId: model.matchId,
      status: model.status,
      direction: model.requesterId === currentUserId ? 'SENT' : 'RECEIVED',
      requester: this.toProfileSummary(model.requester.profile),
      receiver: this.toProfileSummary(model.receiver.profile),
      createdAt: model.createdAt,
    };
  }

  private toProfileSummary(
    profile:
      | (Profile & {
          instruments: { name: string }[];
          styles: { name: string }[];
        })
      | null,
  ): CollaborationProfileSummaryDto | null {
    if (!profile) {
      return null;
    }

    return {
      userId: profile.userId,
      displayName: profile.displayName,
      city: profile.city,
      gender: profile.gender,
      instruments: profile.instruments.map((item) => item.name),
      styles: profile.styles.map((item) => item.name),
    };
  }
}
