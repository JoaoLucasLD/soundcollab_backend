import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CatalogAdminGuard } from '../catalog/catalog-admin.guard';
import { StylesController } from './styles.controller';
import { StylesRepository } from './styles.repository';
import { StylesService } from './styles.service';

@Module({
  imports: [AuthModule],
  controllers: [StylesController],
  providers: [StylesService, StylesRepository, CatalogAdminGuard],
})
export class StylesModule {}
