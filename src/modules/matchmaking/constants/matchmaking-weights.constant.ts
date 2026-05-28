export type MatchmakingCriterion =
  | 'availability'
  | 'collaborationGoals'
  | 'location'
  | 'style'
  | 'instrument'
  | 'experience';

export type MatchmakingWeights = Record<MatchmakingCriterion, number>;

export const DEFAULT_MATCHMAKING_WEIGHTS: MatchmakingWeights = {
  availability: 0.19921875,
  experience: 0.171875,
  style: 0.171875,
  location: 0.16796875,
  collaborationGoals: 0.1640625,
  instrument: 0.125,
};
