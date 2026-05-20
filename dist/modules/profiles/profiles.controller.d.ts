import { RequestWithUser } from '../auth/interfaces/authenticated-user.interface';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { RemoveProfileInstrumentsDto } from './dto/remove-profile-instruments.dto';
import { RemoveProfileStylesDto } from './dto/remove-profile-styles.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UpdateProfileInstrumentsDto } from './dto/update-profile-instruments.dto';
import { UpdateProfileStylesDto } from './dto/update-profile-styles.dto';
import { ProfilesService } from './profiles.service';
export declare class ProfilesController {
    private readonly profilesService;
    constructor(profilesService: ProfilesService);
    getByUserId(userId: string): Promise<ProfileResponseDto>;
    getById(profileId: string): Promise<ProfileResponseDto>;
    updateMyProfile(req: RequestWithUser, body: UpdateMyProfileDto): Promise<ProfileResponseDto>;
    addMyInstruments(req: RequestWithUser, body: UpdateProfileInstrumentsDto): Promise<ProfileResponseDto>;
    replaceMyInstruments(req: RequestWithUser, body: UpdateProfileInstrumentsDto): Promise<ProfileResponseDto>;
    removeMyInstruments(req: RequestWithUser, body: RemoveProfileInstrumentsDto): Promise<ProfileResponseDto>;
    addMyStyles(req: RequestWithUser, body: UpdateProfileStylesDto): Promise<ProfileResponseDto>;
    replaceMyStyles(req: RequestWithUser, body: UpdateProfileStylesDto): Promise<ProfileResponseDto>;
    removeMyStyles(req: RequestWithUser, body: RemoveProfileStylesDto): Promise<ProfileResponseDto>;
}
