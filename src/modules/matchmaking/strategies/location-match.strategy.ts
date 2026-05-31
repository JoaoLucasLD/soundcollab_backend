import { Injectable } from '@nestjs/common';
import {
  calculateDistanceKm,
  Coordinates,
  getCoordinates,
} from '../matchmaking-geo.util';
import {
  MatchmakingStrategy,
  MatchmakingStrategyInput,
} from './matchmaking-strategy.interface';

@Injectable()
export class LocationMatchStrategy implements MatchmakingStrategy {
  readonly key = 'location' as const;

  calculate({ requester, candidate, filters }: MatchmakingStrategyInput): number {
    if (filters.city) {
      return calculateCityCompatibility(filters.city, candidate.city);
    }

    const requesterCoordinates = getCoordinates(requester);
    const candidateCoordinates = getCoordinates(candidate);
    if (requesterCoordinates && candidateCoordinates) {
      return calculateDistanceProximityScore(
        requesterCoordinates,
        candidateCoordinates,
      );
    }

    return calculateCityCompatibility(requester.city, candidate.city);
  }
}


const calculateCityCompatibility = (
  leftValue: string | null,
  rightValue: string | null,
): number => {
  const leftCity = normalizeCity(leftValue);
  const rightCity = normalizeCity(rightValue);

  if (!leftCity || !rightCity) {
    return 0;
  }

  return leftCity === rightCity ? 1 : 0;
};

const normalizeCity = (value: string | null): string | null => {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
};

const calculateDistanceProximityScore = (
  origin: Coordinates,
  destination: Coordinates,
): number => {
  const distanceKm = calculateDistanceKm(origin, destination);

  if (distanceKm <= 5) {
    return 1;
  }
  if (distanceKm <= 15) {
    return 0.85;
  }
  if (distanceKm <= 30) {
    return 0.65;
  }
  if (distanceKm <= 60) {
    return 0.4;
  }

  return 0.1;
};

