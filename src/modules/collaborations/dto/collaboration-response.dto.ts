import { CollaborationStatus } from '@prisma/client';

export class CollaborationResponseDto {
  id!: string;
  requesterId!: string;
  receiverId!: string;
  matchId!: string | null;
  status!: CollaborationStatus;
  createdAt!: Date;
}
