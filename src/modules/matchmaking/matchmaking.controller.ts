import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/authenticated-user.interface';
import { MatchmakingRankingQueryDto } from './dto/matchmaking-ranking-query.dto';
import { MatchmakingRankingResponseDto } from './dto/matchmaking-ranking-response.dto';
import { MatchmakingService } from './matchmaking.service';

@UseGuards(JwtAuthGuard)
@Controller('matchmaking')
export class MatchmakingController {
  constructor(private readonly matchmakingService: MatchmakingService) {}

  @Get('ranking')
  getRanking(
    @Req() req: RequestWithUser,
    @Query() query: MatchmakingRankingQueryDto,
  ): Promise<MatchmakingRankingResponseDto> {
    return this.matchmakingService.getRanking(req.user.userId, query);
  }
}
