import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/authenticated-user.interface';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { RemoveProfileInstrumentsDto } from './dto/remove-profile-instruments.dto';
import { RemoveProfileStylesDto } from './dto/remove-profile-styles.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UpdateProfileInstrumentsDto } from './dto/update-profile-instruments.dto';
import { UpdateProfileStylesDto } from './dto/update-profile-styles.dto';
import { ProfilesService } from './profiles.service';

@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('users/:userId')
  getByUserId(@Param('userId') userId: string): Promise<ProfileResponseDto> {
    return this.profilesService.getByUserId(userId);
  }

  @Get(':profileId')
  getById(@Param('profileId') profileId: string): Promise<ProfileResponseDto> {
    return this.profilesService.getById(profileId);
  }

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

  @Put('me/instruments')
  replaceMyInstruments(
    @Req() req: RequestWithUser,
    @Body() body: UpdateProfileInstrumentsDto,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.replaceMyInstruments(req.user.userId, body);
  }

  @Delete('me/instruments')
  removeMyInstruments(
    @Req() req: RequestWithUser,
    @Body() body: RemoveProfileInstrumentsDto,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.removeMyInstruments(req.user.userId, body);
  }

  @Post('me/styles')
  addMyStyles(
    @Req() req: RequestWithUser,
    @Body() body: UpdateProfileStylesDto,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.addMyStyles(req.user.userId, body);
  }

  @Put('me/styles')
  replaceMyStyles(
    @Req() req: RequestWithUser,
    @Body() body: UpdateProfileStylesDto,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.replaceMyStyles(req.user.userId, body);
  }

  @Delete('me/styles')
  removeMyStyles(
    @Req() req: RequestWithUser,
    @Body() body: RemoveProfileStylesDto,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.removeMyStyles(req.user.userId, body);
  }
}
