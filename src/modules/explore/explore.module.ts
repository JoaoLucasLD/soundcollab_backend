import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ExploreController } from './explore.controller';
import { ExploreRepository } from './explore.repository';
import { ExploreService } from './explore.service';

@Module({
  imports: [AuthModule],
  controllers: [ExploreController],
  providers: [ExploreService, ExploreRepository],
})
export class ExploreModule {}
