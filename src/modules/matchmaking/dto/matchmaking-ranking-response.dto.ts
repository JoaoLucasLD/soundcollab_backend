import {
  AvailabilityPeriod,
  AvailabilityTime,
  CollaborationGoal,
  Gender,
} from '@prisma/client';

export class MatchScoreBreakdownDto {
  availability!: number;
  collaborationGoals!: number;
  location!: number;
  style!: number;
  instrument!: number;
  experience!: number;
}

export class MatchmakingRankingItemDto {
  id!: string;
  userId!: string;
  displayName!: string;
  city!: string | null;
  gender!: Gender | null;
  age!: number | null;
  distanceKm!: number | null;
  experience!: number | null;
  bio!: string | null;
  preferences!: string | null;
  collaborationGoals!: CollaborationGoal[];
  availabilityPeriods!: AvailabilityPeriod[];
  availabilityTimes!: AvailabilityTime[];
  instruments!: string[];
  styles!: string[];
  totalScore!: number;
  scoreBreakdown!: MatchScoreBreakdownDto;
}

export class MatchmakingRankingResponseDto {
  ranking!: MatchmakingRankingItemDto[];
  total!: number;
}
