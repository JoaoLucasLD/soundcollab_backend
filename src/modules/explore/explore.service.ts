import { BadRequestException, Injectable } from '@nestjs/common';
import { Gender } from '@prisma/client';
import {
  ExploreMusicianResponseDto,
  ExploreMusiciansResponseDto,
} from './dto/explore-musician-response.dto';
import { ExploreMusiciansQueryDto } from './dto/explore-musicians-query.dto';
import { ExploreRepository } from './explore.repository';
import {
  calculateAge,
  decryptBirthDate,
} from '../profiles/profile-birth-date.crypto';

type NormalizedExploreFilters = {
  instrument?: string;
  style?: string;
  city?: string;
  gender?: Gender;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  experienceMin?: number;
  experienceMax?: number;
};

@Injectable()
export class ExploreService {
  constructor(private readonly exploreRepository: ExploreRepository) {}

  async listMusicians(
    userId: string,
    query: ExploreMusiciansQueryDto,
  ): Promise<ExploreMusiciansResponseDto> {
    const filters = this.normalizeFilters(query);

    if (
      filters.experienceMin !== undefined &&
      filters.experienceMax !== undefined &&
      filters.experienceMin > filters.experienceMax
    ) {
      throw new BadRequestException(
        'experienceMin must be less than or equal to experienceMax',
      );
    }

    const origin = await this.resolveDistanceOrigin(userId, filters);
    const profiles = await this.exploreRepository.findMusicians({
      excludeUserId: userId,
      ...filters,
    });

    const musicians = profiles
      .map((profile) => ({
        profile,
        distanceKm: origin
          ? calculateDistanceKm(origin, {
              latitude: profile.latitude,
              longitude: profile.longitude,
            })
          : null,
      }))
      .filter((item) => {
        if (!origin || filters.radiusKm === undefined) {
          return true;
        }

        return item.distanceKm !== null && item.distanceKm <= filters.radiusKm;
      })
      .sort((firstItem, secondItem) => {
        if (firstItem.distanceKm === null && secondItem.distanceKm === null) {
          return firstItem.profile.displayName.localeCompare(
            secondItem.profile.displayName,
          );
        }

        if (firstItem.distanceKm === null) {
          return 1;
        }

        if (secondItem.distanceKm === null) {
          return -1;
        }

        return firstItem.distanceKm - secondItem.distanceKm;
      })
      .map<ExploreMusicianResponseDto>(({ profile, distanceKm }) => {
      const birthDate = decryptBirthDate(profile.birthDateEncrypted);

      return {
        id: profile.id,
        userId: profile.userId,
        displayName: profile.displayName,
        city: profile.city,
        gender: profile.gender,
        age: calculateAge(birthDate),
        distanceKm: distanceKm === null ? null : Math.round(distanceKm),
        experience: profile.experience,
        bio: profile.bio,
        preferences: profile.preferences,
        collaborationGoals: profile.collaborationGoals,
        availabilityPeriods: profile.availabilityPeriods,
        availabilityTimes: profile.availabilityTimes,
        instruments: profile.instruments.map((item) => item.name),
        styles: profile.styles.map((item) => item.name),
      };
    });

    return {
      musicians,
      total: musicians.length,
    };
  }

  private normalizeFilters(
    query: ExploreMusiciansQueryDto,
  ): NormalizedExploreFilters {
    const instrument = this.normalizeOptionalText(query.instrument)?.toLowerCase();
    const style = this.normalizeOptionalText(query.style)?.toLowerCase();
    const city = this.normalizeOptionalText(query.city);
    const gender = query.gender;

    return {
      instrument,
      style,
      city,
      gender,
      latitude: query.latitude,
      longitude: query.longitude,
      radiusKm: query.radiusKm,
      experienceMin: query.experienceMin,
      experienceMax: query.experienceMax,
    };
  }

  private async resolveDistanceOrigin(
    userId: string,
    filters: NormalizedExploreFilters,
  ): Promise<GeoPoint | null> {
    if (filters.radiusKm === undefined) {
      return null;
    }

    if (
      (filters.latitude === undefined) !==
      (filters.longitude === undefined)
    ) {
      throw new BadRequestException(
        'latitude and longitude must be provided together',
      );
    }

    if (filters.latitude !== undefined && filters.longitude !== undefined) {
      return {
        latitude: filters.latitude,
        longitude: filters.longitude,
      };
    }

    const profileLocation =
      await this.exploreRepository.findProfileLocation(userId);

    if (
      profileLocation?.latitude === null ||
      profileLocation?.latitude === undefined ||
      profileLocation.longitude === null ||
      profileLocation.longitude === undefined
    ) {
      throw new BadRequestException(
        'Profile location is required to filter by distance',
      );
    }

    return {
      latitude: profileLocation.latitude,
      longitude: profileLocation.longitude,
    };
  }

  private normalizeOptionalText(value: string | undefined): string | undefined {
    if (value === undefined) {
      return undefined;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
  }
}

type GeoPoint = {
  latitude: number;
  longitude: number;
};

function calculateDistanceKm(origin: GeoPoint, destination: {
  latitude: number | null;
  longitude: number | null;
}) {
  if (destination.latitude === null || destination.longitude === null) {
    return null;
  }

  const earthRadiusKm = 6378;
  const latitudeDelta = toRadians(destination.latitude - origin.latitude);
  const longitudeDelta = toRadians(destination.longitude - origin.longitude);
  const originLatitude = toRadians(origin.latitude);
  const destinationLatitude = toRadians(destination.latitude);

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(originLatitude) *
      Math.cos(destinationLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return (
    2 *
    earthRadiusKm *
    Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  );
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}
