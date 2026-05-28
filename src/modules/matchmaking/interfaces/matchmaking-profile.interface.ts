import {
  AvailabilityPeriod,
  AvailabilityTime,
  CollaborationGoal,
} from '@prisma/client';

export interface MatchmakingProfile {
  id: string;
  userId: string;
  displayName: string;
  city: string | null;
  latitude?: number | null;
  longitude?: number | null;
  experience: number | null;
  preferences: string | null;
  collaborationGoals: CollaborationGoal[];
  availabilityPeriods: AvailabilityPeriod[];
  availabilityTimes: AvailabilityTime[];
  instruments: string[];
  styles: string[];
}
