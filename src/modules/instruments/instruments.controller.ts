import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CatalogAdminGuard } from '../catalog/catalog-admin.guard';
import { CreateInstrumentCategoryDto } from './dto/create-instrument-category.dto';
import { CreateInstrumentDto } from './dto/create-instrument.dto';
import {
  InstrumentCategoryResponseDto,
  InstrumentResponseDto,
  ListInstrumentCategoriesResponseDto,
  ListInstrumentsResponseDto,
} from './dto/instrument-response.dto';
import { UpdateInstrumentCategoryDto } from './dto/update-instrument-category.dto';
import { UpdateInstrumentDto } from './dto/update-instrument.dto';
import { InstrumentsService } from './instruments.service';

@UseGuards(JwtAuthGuard)
@Controller('instruments')
export class InstrumentsController {
  constructor(private readonly instrumentsService: InstrumentsService) {}

  @Get()
  list(): Promise<ListInstrumentsResponseDto> {
    return this.instrumentsService.list();
  }

  @Get('categories')
  listCategories(): Promise<ListInstrumentCategoriesResponseDto> {
    return this.instrumentsService.listCategories();
  }

  @UseGuards(CatalogAdminGuard)
  @Post('categories')
  createCategory(
    @Body() body: CreateInstrumentCategoryDto,
  ): Promise<InstrumentCategoryResponseDto> {
    return this.instrumentsService.createCategory(body);
  }

  @UseGuards(CatalogAdminGuard)
  @Patch('categories/:id')
  updateCategory(
    @Param('id') id: string,
    @Body() body: UpdateInstrumentCategoryDto,
  ): Promise<InstrumentCategoryResponseDto> {
    return this.instrumentsService.updateCategory(id, body);
  }

  @UseGuards(CatalogAdminGuard)
  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string): Promise<InstrumentCategoryResponseDto> {
    return this.instrumentsService.deleteCategory(id);
  }

  @UseGuards(CatalogAdminGuard)
  @Post()
  create(@Body() body: CreateInstrumentDto): Promise<InstrumentResponseDto> {
    return this.instrumentsService.create(body);
  }

  @UseGuards(CatalogAdminGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateInstrumentDto,
  ): Promise<InstrumentResponseDto> {
    return this.instrumentsService.update(id, body);
  }

  @UseGuards(CatalogAdminGuard)
  @Delete(':id')
  delete(@Param('id') id: string): Promise<InstrumentResponseDto> {
    return this.instrumentsService.delete(id);
  }
}
