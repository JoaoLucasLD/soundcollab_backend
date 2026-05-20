import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CatalogAdminGuard } from '../catalog/catalog-admin.guard';
import { InstrumentsController } from './instruments.controller';
import { InstrumentsRepository } from './instruments.repository';
import { InstrumentsService } from './instruments.service';

@Module({
  imports: [AuthModule],
  controllers: [InstrumentsController],
  providers: [InstrumentsService, InstrumentsRepository, CatalogAdminGuard],
})
export class InstrumentsModule {}
