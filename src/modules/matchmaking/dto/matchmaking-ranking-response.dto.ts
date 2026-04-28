export class MatchScoreBreakdownDto {
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
  experience!: number | null;
  preferences!: string | null;
  instruments!: string[];
  styles!: string[];
  totalScore!: number;
  scoreBreakdown!: MatchScoreBreakdownDto;
}

export class MatchmakingRankingResponseDto {
  ranking!: MatchmakingRankingItemDto[];
  total!: number;
}
