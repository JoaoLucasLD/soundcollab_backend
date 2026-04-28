import { Injectable } from '@nestjs/common';
import {
  MatchmakingStrategy,
  MatchmakingStrategyInput,
} from './matchmaking-strategy.interface';

@Injectable()
export class StyleMatchStrategy implements MatchmakingStrategy {
  readonly key = 'style' as const;

  calculate({ requester, candidate, filters }: MatchmakingStrategyInput): number {
    if (filters.style) {
      return candidateHasValue(candidate.styles, filters.style) ? 1 : 0;
    }

    return calculateJaccardSimilarity(requester.styles, candidate.styles);
  }
}

const candidateHasValue = (values: string[], expected: string): boolean =>
  normalizeValues(values).includes(expected.trim().toLowerCase());

const normalizeValues = (values: string[]): string[] =>
  values
    .map((value) => value.trim().toLowerCase())
    .filter((value) => value.length > 0);

const calculateJaccardSimilarity = (
  leftValues: string[],
  rightValues: string[],
): number => {
  const left = new Set(normalizeValues(leftValues));
  const right = new Set(normalizeValues(rightValues));

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
