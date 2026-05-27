import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AvailabilityPeriod,
  AvailabilityTime,
  CollaborationGoal,
  Gender,
  Instrument,
  Profile,
  Style,
} from '@prisma/client';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { RemoveProfileInstrumentsDto } from './dto/remove-profile-instruments.dto';
import { RemoveProfileStylesDto } from './dto/remove-profile-styles.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UpdateProfileInstrumentsDto } from './dto/update-profile-instruments.dto';
import { UpdateProfileStylesDto } from './dto/update-profile-styles.dto';
import {
  calculateAge,
  decryptBirthDate,
  encryptBirthDate,
  normalizeBirthDate,
} from './profile-birth-date.crypto';
import { ProfilesRepository } from './profiles.repository';

type ProfileWithRelations = Profile & {
  instruments: Instrument[];
  styles: Style[];
};

@Injectable()
export class ProfilesService {
  constructor(private readonly profilesRepository: ProfilesRepository) {}

  async getByUserId(userId: string): Promise<ProfileResponseDto> {
    const profile = await this.profilesRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Perfil não encontrado para o usuário. Tente novamente.');
    }

    return this.toResponse(profile);
  }

  async getById(profileId: string): Promise<ProfileResponseDto> {
    const profile = await this.profilesRepository.findById(profileId);
    if (!profile) {
      throw new NotFoundException('Perfil não encontrado para o usuário. Tente novamente.');
    }

    return this.toResponse(profile);
  }

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
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        gender: data.gender ?? null,
        birthDateEncrypted: data.birthDateEncrypted ?? null,
        experience: data.experience ?? null,
        preferences: data.preferences ?? null,
        bio: data.bio ?? null,
        collaborationGoals: data.collaborationGoals ?? [],
        availabilityPeriods: data.availabilityPeriods ?? [],
        availabilityTimes: data.availabilityTimes ?? [],
        availabilityNotes: data.availabilityNotes ?? null,
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
      throw new NotFoundException('Perfil não encontrado para o usuário. Tente novamente.');
    }

    const instrumentIds = this.normalizeIdList(input.instrumentIds, 'instrument');
    await this.ensureInstrumentsExist(instrumentIds);

    const updatedProfile = await this.profilesRepository.addInstrumentIds(
      profile.id,
      instrumentIds,
    );

    return this.toResponse(updatedProfile);
  }

  async replaceMyInstruments(
    userId: string,
    input: UpdateProfileInstrumentsDto,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profilesRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Perfil não encontrado para o usuário. Tente novamente.');
    }

    const instrumentIds = this.normalizeIdList(input.instrumentIds, 'instrument', {
      allowEmpty: true,
    });
    await this.ensureInstrumentsExist(instrumentIds);

    const updatedProfile = await this.profilesRepository.setInstrumentIds(
      profile.id,
      instrumentIds,
    );

    return this.toResponse(updatedProfile);
  }

  async removeMyInstruments(
    userId: string,
    input: RemoveProfileInstrumentsDto,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profilesRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Perfil não encontrado para o usuário. Tente novamente.');
    }

    const instrumentIds = this.normalizeIdList(input.instrumentIds, 'instrument');
    await this.ensureInstrumentsExist(instrumentIds);

    const updatedProfile = await this.profilesRepository.removeInstrumentIds(
      profile.id,
      instrumentIds,
    );

    return this.toResponse(updatedProfile);
  }

  async addMyStyles(
    userId: string,
    input: UpdateProfileStylesDto,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profilesRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Perfil não encontrado para o usuário. Tente novamente.');
    }

    const styleIds = this.normalizeIdList(input.styleIds, 'style');
    await this.ensureStylesExist(styleIds);

    const updatedProfile = await this.profilesRepository.addStyleIds(
      profile.id,
      styleIds,
    );

    return this.toResponse(updatedProfile);
  }

  async replaceMyStyles(
    userId: string,
    input: UpdateProfileStylesDto,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profilesRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Perfil não encontrado para o usuário. Tente novamente.');
    }

    const styleIds = this.normalizeIdList(input.styleIds, 'style', {
      allowEmpty: true,
    });
    await this.ensureStylesExist(styleIds);

    const updatedProfile = await this.profilesRepository.setStyleIds(
      profile.id,
      styleIds,
    );

    return this.toResponse(updatedProfile);
  }

  async removeMyStyles(
    userId: string,
    input: RemoveProfileStylesDto,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profilesRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Perfil não encontrado para o usuário. Tente novamente.');
    }

    const styleIds = this.normalizeIdList(input.styleIds, 'style');
    await this.ensureStylesExist(styleIds);

    const updatedProfile = await this.profilesRepository.removeStyleIds(
      profile.id,
      styleIds,
    );

    return this.toResponse(updatedProfile);
  }

  private normalizeProfileUpdate(input: UpdateMyProfileDto): {
    displayName?: string;
    city?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    gender?: Gender | null;
    birthDateEncrypted?: string | null;
    experience?: number | null;
    preferences?: string | null;
    bio?: string | null;
    collaborationGoals?: CollaborationGoal[];
    availabilityPeriods?: AvailabilityPeriod[];
    availabilityTimes?: AvailabilityTime[];
    availabilityNotes?: string | null;
  } {
    const data: {
      displayName?: string;
      city?: string | null;
      latitude?: number | null;
      longitude?: number | null;
      gender?: Gender | null;
      birthDateEncrypted?: string | null;
      experience?: number | null;
      preferences?: string | null;
      bio?: string | null;
      collaborationGoals?: CollaborationGoal[];
      availabilityPeriods?: AvailabilityPeriod[];
      availabilityTimes?: AvailabilityTime[];
      availabilityNotes?: string | null;
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
    if (
      (input.latitude === undefined) !== (input.longitude === undefined)
    ) {
      throw new BadRequestException(
        'latitude and longitude must be provided together',
      );
    }
    if (input.latitude !== undefined && input.longitude !== undefined) {
      data.latitude = input.latitude;
      data.longitude = input.longitude;
    }
    if (input.gender !== undefined) {
      data.gender = input.gender;
    }
    if (input.birthDate !== undefined) {
      const normalizedBirthDate = normalizeBirthDate(input.birthDate);
      data.birthDateEncrypted = encryptBirthDate(normalizedBirthDate);
    }
    if (input.experience !== undefined) {
      data.experience = input.experience;
    }
    if (input.preferences !== undefined) {
      data.preferences = this.normalizeNullableText(input.preferences);
    }
    if (input.bio !== undefined) {
      data.bio = this.normalizeNullableText(input.bio);
    }
    if (input.collaborationGoals !== undefined) {
      data.collaborationGoals = [...new Set(input.collaborationGoals)];
    }
    if (input.availabilityPeriods !== undefined) {
      data.availabilityPeriods = [...new Set(input.availabilityPeriods)];
    }
    if (input.availabilityTimes !== undefined) {
      data.availabilityTimes = [...new Set(input.availabilityTimes)];
    }
    if (input.availabilityNotes !== undefined) {
      data.availabilityNotes = this.normalizeNullableText(
        input.availabilityNotes,
      );
    }

    return data;
  }

  private normalizeNullableText(value: string | null): string | null {
    if (value === null) {
      return null;
    }

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

  private normalizeIdList(
    values: string[],
    label: string,
    options: { allowEmpty?: boolean } = {},
  ): string[] {
    const normalizedValues = values
      .map((value) => value.trim())
      .filter((value) => value.length > 0);

    const uniqueValues = [...new Set(normalizedValues)];
    if (!options.allowEmpty && uniqueValues.length === 0) {
      throw new BadRequestException(`At least one valid ${label} id is required`);
    }

    return uniqueValues;
  }

  private async ensureInstrumentsExist(instrumentIds: string[]): Promise<void> {
    if (instrumentIds.length === 0) {
      return;
    }

    const instruments =
      await this.profilesRepository.findInstrumentsByIds(instrumentIds);
    if (instruments.length !== instrumentIds.length) {
      throw new NotFoundException('One or more instruments were not found');
    }
  }

  private async ensureStylesExist(styleIds: string[]): Promise<void> {
    if (styleIds.length === 0) {
      return;
    }

    const styles = await this.profilesRepository.findStylesByIds(styleIds);
    if (styles.length !== styleIds.length) {
      throw new NotFoundException('One or more styles were not found');
    }
  }

  private toResponse(profile: ProfileWithRelations): ProfileResponseDto {
    const birthDate = decryptBirthDate(profile.birthDateEncrypted);

    return {
      id: profile.id,
      userId: profile.userId,
      displayName: profile.displayName,
      city: profile.city,
      gender: profile.gender,
      age: calculateAge(birthDate),
      experience: profile.experience,
      preferences: profile.preferences,
      bio: profile.bio,
      collaborationGoals: profile.collaborationGoals,
      availabilityPeriods: profile.availabilityPeriods,
      availabilityTimes: profile.availabilityTimes,
      availabilityNotes: profile.availabilityNotes,
      instruments: profile.instruments.map((item) => item.name),
      styles: profile.styles.map((item) => item.name),
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
