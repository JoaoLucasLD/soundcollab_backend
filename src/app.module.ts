import { Module } from '@nestjs/common';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { CollaborationsModule } from './modules/collaborations/collaborations.module';
import { MatchmakingModule } from './modules/matchmaking/matchmaking.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProfilesModule,
    MatchmakingModule,
    CollaborationsModule,
    ChatModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
