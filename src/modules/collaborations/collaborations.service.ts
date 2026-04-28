import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Collaboration, CollaborationStatus } from '@prisma/client';
import { CollaborationsRepository } from './collaborations.repository';
import { CollaborationResponseDto } from './dto/collaboration-response.dto';
import { CreateCollaborationDto } from './dto/create-collaboration.dto';

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

    return this.toResponse(created);
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
    return this.toResponse(updated);
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

  private toResponse(model: Collaboration): CollaborationResponseDto {
    return {
      id: model.id,
      requesterId: model.requesterId,
      receiverId: model.receiverId,
      matchId: model.matchId,
      status: model.status,
      createdAt: model.createdAt,
    };
  }
}
