import { Injectable } from '@nestjs/common';
import {
  MatchmakingStrategy,
  MatchmakingStrategyInput,
} from './matchmaking-strategy.interface';

const MAX_EXPERIENCE_GAP = 20;

@Injectable()
export class ExperienceMatchStrategy implements MatchmakingStrategy {
  readonly key = 'experience' as const;

  calculate({ requester, candidate, filters }: MatchmakingStrategyInput): number {
    if (candidate.experience === null) {
      return 0;
    }

    if (
      filters.experienceMin !== undefined ||
      filters.experienceMax !== undefined
    ) {
      return calculateRangeScore(
        candidate.experience,
        filters.experienceMin,
        filters.experienceMax,
      );
    }

    if (requester.experience === null) {
      return 0;
    }

    return calculateGapScore(
      Math.abs(requester.experience - candidate.experience),
    );
  }
}

const calculateRangeScore = (
  value: number,
  minimum?: number,
  maximum?: number,
): number => {
  if (minimum !== undefined && value < minimum) {
    return calculateGapScore(minimum - value);
  }

  if (maximum !== undefined && value > maximum) {
    return calculateGapScore(value - maximum);
  }

  return 1;
};

const calculateGapScore = (gap: number): number =>
  Math.max(0, 1 - gap / MAX_EXPERIENCE_GAP);
