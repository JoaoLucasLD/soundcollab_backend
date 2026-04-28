import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ExperienceMatchStrategy } from './strategies/experience-match.strategy';
import { MatchScoreCalculator } from './match-score-calculator';
import { MatchmakingController } from './matchmaking.controller';
import { MatchmakingRepository } from './matchmaking.repository';
import { MatchmakingService } from './matchmaking.service';
import { InstrumentMatchStrategy } from './strategies/instrument-match.strategy';
import { LocationMatchStrategy } from './strategies/location-match.strategy';
import { StyleMatchStrategy } from './strategies/style-match.strategy';

@Module({
  imports: [AuthModule],
  controllers: [MatchmakingController],
  providers: [
    MatchmakingService,
    MatchmakingRepository,
    MatchScoreCalculator,
    InstrumentMatchStrategy,
    StyleMatchStrategy,
    LocationMatchStrategy,
    ExperienceMatchStrategy,
  ],
})
export class MatchmakingModule {}
