import { Body, Controller, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/authenticated-user.interface';
import { CollaborationsService } from './collaborations.service';
import { CollaborationResponseDto } from './dto/collaboration-response.dto';
import { CreateCollaborationDto } from './dto/create-collaboration.dto';

@UseGuards(JwtAuthGuard)
@Controller('collaborations')
export class CollaborationsController {
  constructor(private readonly collaborationsService: CollaborationsService) {}

  @Post()
  create(
    @Req() req: RequestWithUser,
    @Body() body: CreateCollaborationDto,
  ): Promise<CollaborationResponseDto> {
    return this.collaborationsService.create(req.user.userId, body);
  }

  @Patch(':id/accept')
  accept(
    @Req() req: RequestWithUser,
    @Param('id') collaborationId: string,
  ): Promise<CollaborationResponseDto> {
    return this.collaborationsService.accept(req.user.userId, collaborationId);
  }

  @Patch(':id/reject')
  reject(
    @Req() req: RequestWithUser,
    @Param('id') collaborationId: string,
  ): Promise<CollaborationResponseDto> {
    return this.collaborationsService.reject(req.user.userId, collaborationId);
  }
}
