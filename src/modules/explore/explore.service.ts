import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ExploreMusicianResponseDto,
  ExploreMusiciansResponseDto,
} from './dto/explore-musician-response.dto';
import { ExploreMusiciansQueryDto } from './dto/explore-musicians-query.dto';
import { ExploreRepository } from './explore.repository';

type NormalizedExploreFilters = {
  instrument?: string;
  style?: string;
  city?: string;
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

    const profiles = await this.exploreRepository.findMusicians({
      excludeUserId: userId,
      ...filters,
    });

    const musicians = profiles.map<ExploreMusicianResponseDto>((profile) => ({
      id: profile.id,
      userId: profile.userId,
      displayName: profile.displayName,
      city: profile.city,
      experience: profile.experience,
      preferences: profile.preferences,
      instruments: profile.instruments.map((item) => item.name),
      styles: profile.styles.map((item) => item.name),
    }));

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

    return {
      instrument,
      style,
      city,
      experienceMin: query.experienceMin,
      experienceMax: query.experienceMax,
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
