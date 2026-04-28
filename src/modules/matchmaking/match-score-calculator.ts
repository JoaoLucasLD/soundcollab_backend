import { Injectable } from '@nestjs/common';
import {
  DEFAULT_MATCHMAKING_WEIGHTS,
  MATCHMAKING_PRIORITY_ORDER,
  MATCHMAKING_PRIORITY_WEIGHT_SLOTS,
  MatchmakingCriterion,
  MatchmakingWeights,
} from './constants/matchmaking-weights.constant';
import { MatchScoreBreakdownDto } from './dto/matchmaking-ranking-response.dto';
import { MatchmakingProfile } from './interfaces/matchmaking-profile.interface';
import { MatchmakingRankingFilters } from './interfaces/matchmaking-ranking-filters.interface';
import { ExperienceMatchStrategy } from './strategies/experience-match.strategy';
import { InstrumentMatchStrategy } from './strategies/instrument-match.strategy';
import { LocationMatchStrategy } from './strategies/location-match.strategy';
import {
  MatchmakingStrategy,
  MatchmakingStrategyInput,
} from './strategies/matchmaking-strategy.interface';
import { StyleMatchStrategy } from './strategies/style-match.strategy';

export type MatchScoreResult = {
  totalScore: number;
  scoreBreakdown: MatchScoreBreakdownDto;
};

@Injectable()
export class MatchScoreCalculator {
  private readonly strategies: MatchmakingStrategy[];

  constructor(
    instrumentStrategy: InstrumentMatchStrategy,
    styleStrategy: StyleMatchStrategy,
    locationStrategy: LocationMatchStrategy,
    experienceStrategy: ExperienceMatchStrategy,
  ) {
    this.strategies = [
      locationStrategy,
      styleStrategy,
      instrumentStrategy,
      experienceStrategy,
    ];
  }

  calculate(
    requester: MatchmakingProfile,
    candidate: MatchmakingProfile,
    filters: MatchmakingRankingFilters = {},
  ): MatchScoreResult {
    const weights = this.createWeights(filters);
    const input: MatchmakingStrategyInput = {
      requester,
      candidate,
      filters,
    };

    const scoreBreakdown = this.createEmptyBreakdown();
    let weightedScore = 0;
    let totalWeight = 0;

    for (const strategy of this.strategies) {
      const rawScore = strategy.calculate(input);
      const normalizedScore = clamp01(rawScore);
      const weight = weights[strategy.key];

      scoreBreakdown[strategy.key] = roundTwoDecimals(normalizedScore * 100);
      weightedScore += normalizedScore * weight;
      totalWeight += weight;
    }

    const totalScore =
      totalWeight > 0 ? roundTwoDecimals((weightedScore / totalWeight) * 100) : 0;

    return {
      totalScore,
      scoreBreakdown,
    };
  }

  private createEmptyBreakdown(): MatchScoreBreakdownDto {
    return {
      location: 0,
      style: 0,
      instrument: 0,
      experience: 0,
    };
  }

  private createWeights(filters: MatchmakingRankingFilters): MatchmakingWeights {
    const promotedCriteria = MATCHMAKING_PRIORITY_ORDER.filter((criterion) =>
      isCriterionFiltered(criterion, filters),
    );
    const remainingCriteria = MATCHMAKING_PRIORITY_ORDER.filter(
      (criterion) => !promotedCriteria.includes(criterion),
    );
    const priorityOrder =
      promotedCriteria.length > 0
        ? [...promotedCriteria, ...remainingCriteria]
        : MATCHMAKING_PRIORITY_ORDER;

    const weights = { ...DEFAULT_MATCHMAKING_WEIGHTS };
    priorityOrder.forEach((criterion, index) => {
      const weight = MATCHMAKING_PRIORITY_WEIGHT_SLOTS[index];
      if (weight !== undefined) {
        weights[criterion] = weight;
      }
    });

    return weights;
  }
}

const isCriterionFiltered = (
  criterion: MatchmakingCriterion,
  filters: MatchmakingRankingFilters,
): boolean => {
  switch (criterion) {
    case 'location':
      return filters.city !== undefined;
    case 'style':
      return filters.style !== undefined;
    case 'instrument':
      return filters.instrument !== undefined;
    case 'experience':
      return (
        filters.experienceMin !== undefined ||
        filters.experienceMax !== undefined
      );
  }
};

const clamp01 = (value: number): number => {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return 0;
  }

  if (value < 0) {
    return 0;
  }
  if (value > 1) {
    return 1;
  }

  return value;
};

const roundTwoDecimals = (value: number): number =>
  Math.round(value * 100) / 100;
