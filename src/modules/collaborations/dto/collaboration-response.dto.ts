import { CollaborationStatus, Gender } from '@prisma/client';

export class CollaborationProfileSummaryDto {
  userId!: string;
  displayName!: string;
  city!: string | null;
  gender!: Gender | null;
  instruments!: string[];
  styles!: string[];
}

export type CollaborationDirection = 'SENT' | 'RECEIVED';

export class CollaborationResponseDto {
  id!: string;
  requesterId!: string;
  receiverId!: string;
  matchId!: string | null;
  status!: CollaborationStatus;
  direction!: CollaborationDirection;
  requester!: CollaborationProfileSummaryDto | null;
  receiver!: CollaborationProfileSummaryDto | null;
  createdAt!: Date;
}
