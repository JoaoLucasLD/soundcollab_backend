import { ProfileResponseDto } from './dto/profile-response.dto';
import { RemoveProfileInstrumentsDto } from './dto/remove-profile-instruments.dto';
import { RemoveProfileStylesDto } from './dto/remove-profile-styles.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UpdateProfileInstrumentsDto } from './dto/update-profile-instruments.dto';
import { UpdateProfileStylesDto } from './dto/update-profile-styles.dto';
import { ProfilesRepository } from './profiles.repository';
export declare class ProfilesService {
    private readonly profilesRepository;
    constructor(profilesRepository: ProfilesRepository);
    getByUserId(userId: string): Promise<ProfileResponseDto>;
    getById(profileId: string): Promise<ProfileResponseDto>;
    upsertMyProfile(userId: string, input: UpdateMyProfileDto): Promise<ProfileResponseDto>;
    addMyInstruments(userId: string, input: UpdateProfileInstrumentsDto): Promise<ProfileResponseDto>;
    replaceMyInstruments(userId: string, input: UpdateProfileInstrumentsDto): Promise<ProfileResponseDto>;
    removeMyInstruments(userId: string, input: RemoveProfileInstrumentsDto): Promise<ProfileResponseDto>;
    addMyStyles(userId: string, input: UpdateProfileStylesDto): Promise<ProfileResponseDto>;
    replaceMyStyles(userId: string, input: UpdateProfileStylesDto): Promise<ProfileResponseDto>;
    removeMyStyles(userId: string, input: RemoveProfileStylesDto): Promise<ProfileResponseDto>;
    private normalizeProfileUpdate;
    private normalizeNullableText;
    private normalizeRequiredText;
    private normalizeIdList;
    private ensureInstrumentsExist;
    private ensureStylesExist;
    private toResponse;
}
