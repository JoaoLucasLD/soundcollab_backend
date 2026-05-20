import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CatalogAdminGuard } from '../catalog/catalog-admin.guard';
import { CreateStyleDto } from './dto/create-style.dto';
import {
  ListStylesResponseDto,
  StyleResponseDto,
} from './dto/style-response.dto';
import { UpdateStyleDto } from './dto/update-style.dto';
import { StylesService } from './styles.service';

@UseGuards(JwtAuthGuard)
@Controller('styles')
export class StylesController {
  constructor(private readonly stylesService: StylesService) {}

  @Get()
  list(): Promise<ListStylesResponseDto> {
    return this.stylesService.list();
  }

  @UseGuards(CatalogAdminGuard)
  @Post()
  create(@Body() body: CreateStyleDto): Promise<StyleResponseDto> {
    return this.stylesService.create(body);
  }

  @UseGuards(CatalogAdminGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateStyleDto,
  ): Promise<StyleResponseDto> {
    return this.stylesService.update(id, body);
  }

  @UseGuards(CatalogAdminGuard)
  @Delete(':id')
  delete(@Param('id') id: string): Promise<StyleResponseDto> {
    return this.stylesService.delete(id);
  }
}
