import { Injectable } from '@nestjs/common';
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

type Coordinates = {
  latitude: number;
  longitude: number;
};

const getCoordinates = (profile: {
  latitude?: number | null;
  longitude?: number | null;
}): Coordinates | null => {
  if (
    profile.latitude === undefined ||
    profile.latitude === null ||
    profile.longitude === undefined ||
    profile.longitude === null
  ) {
    return null;
  }

  return {
    latitude: profile.latitude,
    longitude: profile.longitude,
  };
};

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
  const distanceKm = haversineKm(origin, destination);

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

const haversineKm = (origin: Coordinates, destination: Coordinates): number => {
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(destination.latitude - origin.latitude);
  const longitudeDelta = toRadians(destination.longitude - origin.longitude);
  const originLatitude = toRadians(origin.latitude);
  const destinationLatitude = toRadians(destination.latitude);

  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(originLatitude) *
      Math.cos(destinationLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
};

const toRadians = (value: number): number => (value * Math.PI) / 180;
