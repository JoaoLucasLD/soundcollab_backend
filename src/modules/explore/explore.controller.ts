import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/authenticated-user.interface';
import { ExploreMusiciansQueryDto } from './dto/explore-musicians-query.dto';
import { ExploreMusiciansResponseDto } from './dto/explore-musician-response.dto';
import { ExploreService } from './explore.service';

@UseGuards(JwtAuthGuard)
@Controller('explore')
export class ExploreController {
  constructor(private readonly exploreService: ExploreService) {}

  @Get('musicians')
  listMusicians(
    @Req() req: RequestWithUser,
    @Query() query: ExploreMusiciansQueryDto,
  ): Promise<ExploreMusiciansResponseDto> {
    return this.exploreService.listMusicians(req.user.userId, query);
  }
}
