import { Injectable } from '@nestjs/common';
import {
  MatchmakingStrategy,
  MatchmakingStrategyInput,
} from './matchmaking-strategy.interface';

@Injectable()
export class CollaborationGoalsMatchStrategy implements MatchmakingStrategy {
  readonly key = 'collaborationGoals' as const;

  calculate({ requester, candidate }: MatchmakingStrategyInput): number {
    return calculateJaccardSimilarity(
      requester.collaborationGoals,
      candidate.collaborationGoals,
    );
  }
}

const calculateJaccardSimilarity = <T>(
  leftValues: T[],
  rightValues: T[],
): number => {
  const left = new Set(leftValues);
  const right = new Set(rightValues);

  if (left.size === 0 || right.size === 0) {
    return 0;
  }

  let intersection = 0;
  for (const value of left) {
    if (right.has(value)) {
      intersection += 1;
    }
  }

  const union = left.size + right.size - intersection;
  return union > 0 ? intersection / union : 0;
};
