import { Injectable } from '@nestjs/common';
import {
  AvailabilityPeriod,
  AvailabilityTime,
  CollaborationGoal,
  Instrument,
  Profile,
  Style,
} from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

type ProfileWithRelations = Profile & {
  collaborationGoals: CollaborationGoal[];
  availabilityPeriods: AvailabilityPeriod[];
  availabilityTimes: AvailabilityTime[];
  instruments: Instrument[];
  styles: Style[];
};

@Injectable()
export class MatchmakingRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string): Promise<ProfileWithRelations | null> {
    return this.prisma.profile.findUnique({
      where: { userId },
      include: {
        instruments: true,
        styles: true,
      },
    });
  }

  findCandidates(excludeUserId: string): Promise<ProfileWithRelations[]> {
    return this.prisma.profile.findMany({
      where: {
        userId: {
          not: excludeUserId,
        },
      },
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
