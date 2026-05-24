import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  calculateAge,
  decryptBirthDate,
} from '../profiles/profile-birth-date.crypto';
import { MeResponseDto } from './dto/me-response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string): Promise<MeResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            instruments: true,
            styles: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const birthDate = user.profile
      ? decryptBirthDate(user.profile.birthDateEncrypted)
      : null;

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      profile: user.profile
        ? {
            id: user.profile.id,
            displayName: user.profile.displayName,
            city: user.profile.city,
            latitude: user.profile.latitude,
            longitude: user.profile.longitude,
            gender: user.profile.gender,
            birthDate,
            age: calculateAge(birthDate),
            experience: user.profile.experience,
            preferences: user.profile.preferences,
            bio: user.profile.bio,
            collaborationGoals: user.profile.collaborationGoals,
            availabilityPeriods: user.profile.availabilityPeriods,
            availabilityTimes: user.profile.availabilityTimes,
            availabilityNotes: user.profile.availabilityNotes,
            instruments: user.profile.instruments.map((item) => item.name),
            styles: user.profile.styles.map((item) => item.name),
          }
        : null,
    };
  }
}
