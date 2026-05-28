import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  AvailabilityPeriod,
  AvailabilityTime,
  CollaborationGoal,
  Gender,
} from '@prisma/client';
import {
  calculateAge,
  decryptBirthDate,
} from '../profiles/profile-birth-date.crypto';
import { MatchmakingRankingQueryDto } from './dto/matchmaking-ranking-query.dto';
import {
  MatchmakingRankingItemDto,
  MatchmakingRankingResponseDto,
} from './dto/matchmaking-ranking-response.dto';
import { MatchmakingProfile } from './interfaces/matchmaking-profile.interface';
import { MatchmakingRankingFilters } from './interfaces/matchmaking-ranking-filters.interface';
import { MatchScoreCalculator } from './match-score-calculator';
import { MatchmakingRepository } from './matchmaking.repository';

@Injectable()
export class MatchmakingService {
  constructor(
    private readonly matchmakingRepository: MatchmakingRepository,
    private readonly matchScoreCalculator: MatchScoreCalculator,
  ) {}

  async getRanking(
    userId: string,
    query: MatchmakingRankingQueryDto,
  ): Promise<MatchmakingRankingResponseDto> {
    const requesterProfile = await this.matchmakingRepository.findByUserId(userId);
    if (!requesterProfile) {
      throw new NotFoundException('Profile not found');
    }

    const requester = this.toMatchmakingProfile(requesterProfile);
    const filters = this.normalizeFilters(query);
    const candidateProfiles =
      await this.matchmakingRepository.findCandidates(userId);

    const ranking = candidateProfiles
      .map<MatchmakingRankingItemDto>((profile) => {
        const candidate = this.toMatchmakingProfile(profile);
        const score = this.matchScoreCalculator.calculate(
          requester,
          candidate,
          filters,
        );

        return {
          id: candidate.id,
          userId: candidate.userId,
          displayName: candidate.displayName,
          city: candidate.city,
          gender: profile.gender,
          age: calculateAge(decryptBirthDate(profile.birthDateEncrypted)),
          experience: candidate.experience,
          bio: profile.bio,
          preferences: candidate.preferences,
          collaborationGoals: candidate.collaborationGoals,
          availabilityPeriods: candidate.availabilityPeriods,
          availabilityTimes: candidate.availabilityTimes,
          instruments: candidate.instruments,
          styles: candidate.styles,
          totalScore: score.totalScore,
          scoreBreakdown: score.scoreBreakdown,
        };
      })
      .sort((left, right) => {
        if (right.totalScore !== left.totalScore) {
          return right.totalScore - left.totalScore;
        }

        return left.displayName.localeCompare(right.displayName);
      });

    return {
      ranking,
      total: ranking.length,
    };
  }

  private normalizeFilters(
    query: MatchmakingRankingQueryDto,
  ): MatchmakingRankingFilters {
    const city = this.normalizeOptionalText(query.city);
    const style = this.normalizeOptionalText(query.style)?.toLowerCase();
    const instrument = this.normalizeOptionalText(query.instrument)?.toLowerCase();
    const experienceMin = query.experienceMin;
    const experienceMax = query.experienceMax;

    if (
      experienceMin !== undefined &&
      experienceMax !== undefined &&
      experienceMin > experienceMax
    ) {
      throw new BadRequestException(
        'experienceMin must be less than or equal to experienceMax',
      );
    }

    return {
      city,
      style,
      instrument,
      experienceMin,
      experienceMax,
    };
  }

  private normalizeOptionalText(value: string | undefined): string | undefined {
    if (value === undefined) {
      return undefined;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
  }

  private toMatchmakingProfile(profile: {
    id: string;
    userId: string;
    displayName: string;
    city: string | null;
    gender: Gender | null;
    birthDateEncrypted: string | null;
    latitude?: number | null;
    longitude?: number | null;
    experience: number | null;
    bio: string | null;
    preferences: string | null;
    collaborationGoals: CollaborationGoal[];
    availabilityPeriods: AvailabilityPeriod[];
    availabilityTimes: AvailabilityTime[];
    instruments: { name: string }[];
    styles: { name: string }[];
  }): MatchmakingProfile {
    return {
      id: profile.id,
      userId: profile.userId,
      displayName: profile.displayName,
      city: profile.city,
      latitude: profile.latitude,
      longitude: profile.longitude,
      experience: profile.experience,
      preferences: profile.preferences,
      collaborationGoals: profile.collaborationGoals,
      availabilityPeriods: profile.availabilityPeriods,
      availabilityTimes: profile.availabilityTimes,
      instruments: profile.instruments.map((item) => item.name),
      styles: profile.styles.map((item) => item.name),
    };
  }
}
