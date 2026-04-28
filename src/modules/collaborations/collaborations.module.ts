import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CollaborationsController } from './collaborations.controller';
import { CollaborationsRepository } from './collaborations.repository';
import { CollaborationsService } from './collaborations.service';

@Module({
  imports: [AuthModule],
  controllers: [CollaborationsController],
  providers: [CollaborationsService, CollaborationsRepository],
})
export class CollaborationsModule {}
