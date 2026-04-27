import { RequestWithUser } from '../auth/interfaces/authenticated-user.interface';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UpdateProfileInstrumentsDto } from './dto/update-profile-instruments.dto';
import { UpdateProfileStylesDto } from './dto/update-profile-styles.dto';
import { ProfilesService } from './profiles.service';
export declare class ProfilesController {
    private readonly profilesService;
    constructor(profilesService: ProfilesService);
    updateMyProfile(req: RequestWithUser, body: UpdateMyProfileDto): Promise<ProfileResponseDto>;
    addMyInstruments(req: RequestWithUser, body: UpdateProfileInstrumentsDto): Promise<ProfileResponseDto>;
    addMyStyles(req: RequestWithUser, body: UpdateProfileStylesDto): Promise<ProfileResponseDto>;
}
