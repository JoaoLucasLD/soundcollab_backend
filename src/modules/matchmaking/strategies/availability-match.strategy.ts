import { Injectable } from '@nestjs/common';
import {
  MatchmakingStrategy,
  MatchmakingStrategyInput,
} from './matchmaking-strategy.interface';

@Injectable()
export class AvailabilityMatchStrategy implements MatchmakingStrategy {
  readonly key = 'availability' as const;

  calculate({ requester, candidate }: MatchmakingStrategyInput): number {
    const hasPeriodInCommon = hasIntersection(
      requester.availabilityPeriods,
      candidate.availabilityPeriods,
    );
    const hasTimeInCommon = hasIntersection(
      requester.availabilityTimes,
      candidate.availabilityTimes,
    );

    return hasPeriodInCommon && hasTimeInCommon ? 1 : 0;
  }
}

const hasIntersection = <T>(leftValues: T[], rightValues: T[]): boolean => {
  if (leftValues.length === 0 || rightValues.length === 0) {
    return false;
  }

  const right = new Set(rightValues);
  return leftValues.some((value) => right.has(value));
};
