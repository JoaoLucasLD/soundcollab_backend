import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/authenticated-user.interface';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UpdateProfileInstrumentsDto } from './dto/update-profile-instruments.dto';
import { UpdateProfileStylesDto } from './dto/update-profile-styles.dto';
import { ProfilesService } from './profiles.service';

@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Patch('me')
  updateMyProfile(
    @Req() req: RequestWithUser,
    @Body() body: UpdateMyProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.upsertMyProfile(req.user.userId, body);
  }

  @Post('me/instruments')
  addMyInstruments(
    @Req() req: RequestWithUser,
    @Body() body: UpdateProfileInstrumentsDto,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.addMyInstruments(req.user.userId, body);
  }

  @Post('me/styles')
  addMyStyles(
    @Req() req: RequestWithUser,
    @Body() body: UpdateProfileStylesDto,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.addMyStyles(req.user.userId, body);
  }
}
