import { Injectable } from '@nestjs/common';
import {
  AvailabilityPeriod,
  AvailabilityTime,
  CollaborationGoal,
  Gender,
  Instrument,
  Profile,
  Style,
} from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

type ProfileWithRelations = Profile & {
  instruments: Instrument[];
  styles: Style[];
};

type CreateProfileParams = {
  userId: string;
  displayName: string;
  city: string | null;
  gender: Gender | null;
  birthDateEncrypted: string | null;
  experience: number | null;
  preferences: string | null;
  bio: string | null;
  collaborationGoals: CollaborationGoal[];
  availabilityPeriods: AvailabilityPeriod[];
  availabilityTimes: AvailabilityTime[];
  availabilityNotes: string | null;
};

type UpdateProfileParams = {
  displayName?: string;
  city?: string | null;
  gender?: Gender | null;
  birthDateEncrypted?: string | null;
  experience?: number | null;
  preferences?: string | null;
  bio?: string | null;
  collaborationGoals?: CollaborationGoal[];
  availabilityPeriods?: AvailabilityPeriod[];
  availabilityTimes?: AvailabilityTime[];
  availabilityNotes?: string | null;
};

@Injectable()
export class ProfilesRepository {
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

  findById(profileId: string): Promise<ProfileWithRelations | null> {
    return this.prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        instruments: true,
        styles: true,
      },
    });
  }

  create(params: CreateProfileParams): Promise<ProfileWithRelations> {
    return this.prisma.profile.create({
      data: {
        userId: params.userId,
        displayName: params.displayName,
        city: params.city,
        gender: params.gender,
        birthDateEncrypted: params.birthDateEncrypted,
        experience: params.experience,
        preferences: params.preferences,
        bio: params.bio,
        collaborationGoals: params.collaborationGoals,
        availabilityPeriods: params.availabilityPeriods,
        availabilityTimes: params.availabilityTimes,
        availabilityNotes: params.availabilityNotes,
      },
      include: {
        instruments: true,
        styles: true,
      },
    });
  }

  updateById(
    profileId: string,
    data: UpdateProfileParams,
  ): Promise<ProfileWithRelations> {
    return this.prisma.profile.update({
      where: { id: profileId },
      data,
      include: {
        instruments: true,
        styles: true,
      },
    });
  }

  findInstrumentsByIds(instrumentIds: string[]): Promise<Instrument[]> {
    return this.prisma.instrument.findMany({
      where: {
        id: {
          in: instrumentIds,
        },
      },
    });
  }

  findStylesByIds(styleIds: string[]): Promise<Style[]> {
    return this.prisma.style.findMany({
      where: {
        id: {
          in: styleIds,
        },
      },
    });
  }

  addInstrumentIds(
    profileId: string,
    instrumentIds: string[],
  ): Promise<ProfileWithRelations> {
    return this.prisma.profile.update({
      where: { id: profileId },
      data: {
        instruments: {
          connect: instrumentIds.map((id) => ({ id })),
        },
      },
      include: {
        instruments: true,
        styles: true,
      },
    });
  }

  setInstrumentIds(
    profileId: string,
    instrumentIds: string[],
  ): Promise<ProfileWithRelations> {
    return this.prisma.profile.update({
      where: { id: profileId },
      data: {
        instruments: {
          set: instrumentIds.map((id) => ({ id })),
        },
      },
      include: {
        instruments: true,
        styles: true,
      },
    });
  }

  removeInstrumentIds(
    profileId: string,
    instrumentIds: string[],
  ): Promise<ProfileWithRelations> {
    return this.prisma.profile.update({
      where: { id: profileId },
      data: {
        instruments: {
          disconnect: instrumentIds.map((id) => ({ id })),
        },
      },
      include: {
        instruments: true,
        styles: true,
      },
    });
  }

  addStyleIds(
    profileId: string,
    styleIds: string[],
  ): Promise<ProfileWithRelations> {
    return this.prisma.profile.update({
      where: { id: profileId },
      data: {
        styles: {
          connect: styleIds.map((id) => ({ id })),
        },
      },
      include: {
        instruments: true,
        styles: true,
      },
    });
  }

  setStyleIds(
    profileId: string,
    styleIds: string[],
  ): Promise<ProfileWithRelations> {
    return this.prisma.profile.update({
      where: { id: profileId },
      data: {
        styles: {
          set: styleIds.map((id) => ({ id })),
        },
      },
      include: {
        instruments: true,
        styles: true,
      },
    });
  }

  removeStyleIds(
    profileId: string,
    styleIds: string[],
  ): Promise<ProfileWithRelations> {
    return this.prisma.profile.update({
      where: { id: profileId },
      data: {
        styles: {
          disconnect: styleIds.map((id) => ({ id })),
        },
      },
      include: {
        instruments: true,
        styles: true,
      },
    });
  }
}
