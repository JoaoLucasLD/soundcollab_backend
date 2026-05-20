import { Injectable } from '@nestjs/common';
import { Gender, Instrument, Prisma, Profile, Style } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

export type ExploreFilters = {
  excludeUserId: string;
  instrument?: string;
  style?: string;
  city?: string;
  gender?: Gender;
  experienceMin?: number;
  experienceMax?: number;
};

type ProfileWithRelations = Profile & {
  instruments: Instrument[];
  styles: Style[];
};

@Injectable()
export class ExploreRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMusicians(filters: ExploreFilters): Promise<ProfileWithRelations[]> {
    const where: Prisma.ProfileWhereInput = {
      userId: {
        not: filters.excludeUserId,
      },
    };

    if (filters.instrument) {
      where.instruments = {
        some: {
          name: filters.instrument,
        },
      };
    }

    if (filters.style) {
      where.styles = {
        some: {
          name: filters.style,
        },
      };
    }

    if (filters.city) {
      where.city = {
        equals: filters.city,
        mode: 'insensitive',
      };
    }

    if (filters.gender) {
      where.gender = filters.gender;
    }

    if (
      filters.experienceMin !== undefined ||
      filters.experienceMax !== undefined
    ) {
      const experienceFilter: Prisma.IntNullableFilter = {};

      if (filters.experienceMin !== undefined) {
        experienceFilter.gte = filters.experienceMin;
      }

      if (filters.experienceMax !== undefined) {
        experienceFilter.lte = filters.experienceMax;
      }

      where.experience = experienceFilter;
    }

    return this.prisma.profile.findMany({
      where,
      include: {
        instruments: true,
        styles: true,
      },
      orderBy: {
        displayName: 'asc',
      },
    });
  }
}
