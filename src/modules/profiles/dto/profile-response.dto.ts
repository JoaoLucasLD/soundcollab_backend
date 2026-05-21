import {
  AvailabilityPeriod,
  AvailabilityTime,
  CollaborationGoal,
  Gender,
} from '@prisma/client';

export class ProfileResponseDto {
  id!: string;
  userId!: string;
  displayName!: string;
  city!: string | null;
  gender!: Gender | null;
  age!: number | null;
  experience!: number | null;
  preferences!: string | null;
  bio!: string | null;
  collaborationGoals!: CollaborationGoal[];
  availabilityPeriods!: AvailabilityPeriod[];
  availabilityTimes!: AvailabilityTime[];
  availabilityNotes!: string | null;
  instruments!: string[];
  styles!: string[];
  createdAt!: Date;
  updatedAt!: Date;
}
