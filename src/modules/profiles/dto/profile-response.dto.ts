import { CollaborationGoal, Gender } from '@prisma/client';

export class ProfileResponseDto {
  id!: string;
  userId!: string;
  displayName!: string;
  city!: string | null;
  gender!: Gender | null;
  experience!: number | null;
  preferences!: string | null;
  bio!: string | null;
  collaborationGoals!: CollaborationGoal[];
  instruments!: string[];
  styles!: string[];
  createdAt!: Date;
  updatedAt!: Date;
}
