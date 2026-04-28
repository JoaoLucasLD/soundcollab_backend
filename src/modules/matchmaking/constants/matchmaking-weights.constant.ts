export type MatchmakingCriterion =
  | 'location'
  | 'style'
  | 'instrument'
  | 'experience';

export type MatchmakingWeights = Record<MatchmakingCriterion, number>;

export const MATCHMAKING_PRIORITY_ORDER: MatchmakingCriterion[] = [
  'location',
  'style',
  'instrument',
  'experience',
];

export const MATCHMAKING_PRIORITY_WEIGHT_SLOTS = [0.4, 0.3, 0.2, 0.1] as const;

export const DEFAULT_MATCHMAKING_WEIGHTS: MatchmakingWeights = {
  location: 0.4,
  style: 0.3,
  instrument: 0.2,
  experience: 0.1,
};
