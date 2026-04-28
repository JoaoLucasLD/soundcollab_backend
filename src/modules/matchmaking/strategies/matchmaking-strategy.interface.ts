import { MatchmakingCriterion } from '../constants/matchmaking-weights.constant';
import { MatchmakingProfile } from '../interfaces/matchmaking-profile.interface';
import { MatchmakingRankingFilters } from '../interfaces/matchmaking-ranking-filters.interface';

export type MatchmakingStrategyInput = {
  requester: MatchmakingProfile;
  candidate: MatchmakingProfile;
  filters: MatchmakingRankingFilters;
};

export interface MatchmakingStrategy {
  readonly key: MatchmakingCriterion;
  calculate(input: MatchmakingStrategyInput): number;
}
