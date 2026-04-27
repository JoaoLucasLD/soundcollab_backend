import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Instrument, Profile, Style } from '@prisma/client';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UpdateProfileInstrumentsDto } from './dto/update-profile-instruments.dto';
import { UpdateProfileStylesDto } from './dto/update-profile-styles.dto';
import { ProfilesRepository } from './profiles.repository';

type ProfileWithRelations = Profile & {
  instruments: Instrument[];
  styles: Style[];
};

@Injectable()
export class ProfilesService {
  constructor(private readonly profilesRepository: ProfilesRepository) {}

  async upsertMyProfile(
    userId: string,
    input: UpdateMyProfileDto,
  ): Promise<ProfileResponseDto> {
    const existingProfile = await this.profilesRepository.findByUserId(userId);
    const data = this.normalizeProfileUpdate(input);

    if (!existingProfile) {
      if (!data.displayName) {
        throw new BadRequestException(
          'displayName is required when creating profile',
        );
      }

      const createdProfile = await this.profilesRepository.create({
        userId,
        displayName: data.displayName,
        city: data.city ?? null,
        experience: data.experience ?? null,
        preferences: data.preferences ?? null,
      });
      return this.toResponse(createdProfile);
    }

    if (Object.keys(data).length === 0) {
      return this.toResponse(existingProfile);
    }

    const updatedProfile = await this.profilesRepository.updateById(
      existingProfile.id,
      data,
    );
    return this.toResponse(updatedProfile);
  }

  async addMyInstruments(
    userId: string,
    input: UpdateProfileInstrumentsDto,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profilesRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const instruments = this.normalizeTermList(input.instruments, 'instrument');
    const updatedProfile = await this.profilesRepository.addInstruments(
      profile.id,
      instruments,
    );

    return this.toResponse(updatedProfile);
  }

  async addMyStyles(
    userId: string,
    input: UpdateProfileStylesDto,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profilesRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const styles = this.normalizeTermList(input.styles, 'style');
    const updatedProfile = await this.profilesRepository.addStyles(
      profile.id,
      styles,
    );

    return this.toResponse(updatedProfile);
  }

  private normalizeProfileUpdate(input: UpdateMyProfileDto): {
    displayName?: string;
    city?: string | null;
    experience?: number | null;
    preferences?: string | null;
  } {
    const data: {
      displayName?: string;
      city?: string | null;
      experience?: number | null;
      preferences?: string | null;
    } = {};

    if (input.displayName !== undefined) {
      data.displayName = this.normalizeRequiredText(
        input.displayName,
        'displayName',
      );
    }
    if (input.city !== undefined) {
      data.city = this.normalizeNullableText(input.city);
    }
    if (input.experience !== undefined) {
      data.experience = input.experience;
    }
    if (input.preferences !== undefined) {
      data.preferences = this.normalizeNullableText(input.preferences);
    }

    return data;
  }

  private normalizeNullableText(value: string): string | null {
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
  }

  private normalizeRequiredText(value: string, field: string): string {
    const normalized = value.trim();
    if (normalized.length === 0) {
      throw new BadRequestException(`${field} cannot be empty`);
    }

    return normalized;
  }

  private normalizeTermList(values: string[], label: string): string[] {
    const normalizedValues = values
      .map((value) => value.trim().toLowerCase())
      .filter((value) => value.length > 0);

    const uniqueValues = [...new Set(normalizedValues)];
    if (uniqueValues.length === 0) {
      throw new BadRequestException(`At least one valid ${label} is required`);
    }

    return uniqueValues;
  }

  private toResponse(profile: ProfileWithRelations): ProfileResponseDto {
    return {
      id: profile.id,
      userId: profile.userId,
      displayName: profile.displayName,
      city: profile.city,
      experience: profile.experience,
      preferences: profile.preferences,
      instruments: profile.instruments.map((item) => item.name),
      styles: profile.styles.map((item) => item.name),
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
