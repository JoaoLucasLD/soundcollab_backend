import { Injectable } from '@nestjs/common';
import {
  DEFAULT_MATCHMAKING_WEIGHTS,
  MatchmakingWeights,
} from './constants/matchmaking-weights.constant';
import { MatchScoreBreakdownDto } from './dto/matchmaking-ranking-response.dto';
import { MatchmakingProfile } from './interfaces/matchmaking-profile.interface';
import { MatchmakingRankingFilters } from './interfaces/matchmaking-ranking-filters.interface';
import { AvailabilityMatchStrategy } from './strategies/availability-match.strategy';
import { CollaborationGoalsMatchStrategy } from './strategies/collaboration-goals-match.strategy';
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
    availabilityStrategy: AvailabilityMatchStrategy,
    collaborationGoalsStrategy: CollaborationGoalsMatchStrategy,
    instrumentStrategy: InstrumentMatchStrategy,
    styleStrategy: StyleMatchStrategy,
    locationStrategy: LocationMatchStrategy,
    experienceStrategy: ExperienceMatchStrategy,
  ) {
    this.strategies = [
      availabilityStrategy,
      experienceStrategy,
      styleStrategy,
      locationStrategy,
      collaborationGoalsStrategy,
      instrumentStrategy,
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
      availability: 0,
      collaborationGoals: 0,
      location: 0,
      style: 0,
      instrument: 0,
      experience: 0,
    };
  }

  private createWeights(filters: MatchmakingRankingFilters): MatchmakingWeights {
    void filters;
    return { ...DEFAULT_MATCHMAKING_WEIGHTS };
  }
}

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
