import { Injectable } from '@nestjs/common';
import { Instrument, Profile, Style } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

type ProfileWithRelations = Profile & {
  instruments: Instrument[];
  styles: Style[];
};

type CreateProfileParams = {
  userId: string;
  displayName: string;
  city: string | null;
  experience: number | null;
  preferences: string | null;
};

type UpdateProfileParams = {
  displayName?: string;
  city?: string | null;
  experience?: number | null;
  preferences?: string | null;
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

  create(params: CreateProfileParams): Promise<ProfileWithRelations> {
    return this.prisma.profile.create({
      data: {
        userId: params.userId,
        displayName: params.displayName,
        city: params.city,
        experience: params.experience,
        preferences: params.preferences,
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

  addInstruments(
    profileId: string,
    instruments: string[],
  ): Promise<ProfileWithRelations> {
    return this.prisma.profile.update({
      where: { id: profileId },
      data: {
        instruments: {
          connectOrCreate: instruments.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: {
        instruments: true,
        styles: true,
      },
    });
  }

  addStyles(profileId: string, styles: string[]): Promise<ProfileWithRelations> {
    return this.prisma.profile.update({
      where: { id: profileId },
      data: {
        styles: {
          connectOrCreate: styles.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: {
        instruments: true,
        styles: true,
      },
    });
  }
}
