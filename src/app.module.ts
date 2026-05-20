import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { CollaborationsModule } from './modules/collaborations/collaborations.module';
import { ExploreModule } from './modules/explore/explore.module';
import { InstrumentsModule } from './modules/instruments/instruments.module';
import { MatchmakingModule } from './modules/matchmaking/matchmaking.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { StylesModule } from './modules/styles/styles.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    InstrumentsModule,
    StylesModule,
    ExploreModule,
    MatchmakingModule,
    CollaborationsModule,
    ChatModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
