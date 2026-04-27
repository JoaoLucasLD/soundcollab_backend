import { ProfileResponseDto } from './dto/profile-response.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UpdateProfileInstrumentsDto } from './dto/update-profile-instruments.dto';
import { UpdateProfileStylesDto } from './dto/update-profile-styles.dto';
import { ProfilesRepository } from './profiles.repository';
export declare class ProfilesService {
    private readonly profilesRepository;
    constructor(profilesRepository: ProfilesRepository);
    upsertMyProfile(userId: string, input: UpdateMyProfileDto): Promise<ProfileResponseDto>;
    addMyInstruments(userId: string, input: UpdateProfileInstrumentsDto): Promise<ProfileResponseDto>;
    addMyStyles(userId: string, input: UpdateProfileStylesDto): Promise<ProfileResponseDto>;
    private normalizeProfileUpdate;
    private normalizeNullableText;
    private normalizeRequiredText;
    private normalizeTermList;
    private toResponse;
}
