import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
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

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      profile: user.profile
        ? {
            id: user.profile.id,
            displayName: user.profile.displayName,
            city: user.profile.city,
            gender: user.profile.gender,
            experience: user.profile.experience,
            preferences: user.profile.preferences,
            bio: user.profile.bio,
            collaborationGoals: user.profile.collaborationGoals,
            instruments: user.profile.instruments.map((item) => item.name),
            styles: user.profile.styles.map((item) => item.name),
          }
        : null,
    };
  }
}
