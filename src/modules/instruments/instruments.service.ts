import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InstrumentCategory } from '@prisma/client';
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
import {
  InstrumentsRepository,
  InstrumentWithCategory,
} from './instruments.repository';

@Injectable()
export class InstrumentsService {
  constructor(private readonly instrumentsRepository: InstrumentsRepository) {}

  async list(): Promise<ListInstrumentsResponseDto> {
    const instruments = await this.instrumentsRepository.findAll();

    return {
      items: instruments.map((instrument) => this.toResponse(instrument)),
      total: instruments.length,
    };
  }

  async listCategories(): Promise<ListInstrumentCategoriesResponseDto> {
    const categories = await this.instrumentsRepository.findCategories();

    return {
      items: categories.map((category) => this.toCategoryResponse(category)),
      total: categories.length,
    };
  }

  async createCategory(
    input: CreateInstrumentCategoryDto,
  ): Promise<InstrumentCategoryResponseDto> {
    const name = this.normalizeName(input.name);
    await this.ensureCategoryNameIsAvailable(name);

    const created = await this.instrumentsRepository.createCategory(name);
    return this.toCategoryResponse(created);
  }

  async updateCategory(
    id: string,
    input: UpdateInstrumentCategoryDto,
  ): Promise<InstrumentCategoryResponseDto> {
    const category = await this.instrumentsRepository.findCategoryById(id);
    if (!category) {
      throw new NotFoundException('Instrument category not found');
    }

    const name = this.normalizeName(input.name);
    if (name !== category.name) {
      await this.ensureCategoryNameIsAvailable(name);
    }

    const updated = await this.instrumentsRepository.updateCategory(id, name);
    return this.toCategoryResponse(updated);
  }

  async deleteCategory(id: string): Promise<InstrumentCategoryResponseDto> {
    const category = await this.instrumentsRepository.findCategoryById(id);
    if (!category) {
      throw new NotFoundException('Instrument category not found');
    }

    const instrumentCount =
      await this.instrumentsRepository.countInstrumentsByCategoryId(id);
    if (instrumentCount > 0) {
      throw new BadRequestException(
        'Instrument category cannot be deleted while it has instruments',
      );
    }

    const deleted = await this.instrumentsRepository.deleteCategory(id);
    return this.toCategoryResponse(deleted);
  }

  async create(input: CreateInstrumentDto): Promise<InstrumentResponseDto> {
    const name = this.normalizeName(input.name);
    await this.ensureNameIsAvailable(name);
    await this.ensureCategoryExists(input.categoryId);

    const created = await this.instrumentsRepository.create(
      name,
      input.categoryId,
    );
    return this.toResponse(created);
  }

  async update(
    id: string,
    input: UpdateInstrumentDto,
  ): Promise<InstrumentResponseDto> {
    const instrument = await this.instrumentsRepository.findById(id);
    if (!instrument) {
      throw new NotFoundException('Instrument not found');
    }

    const name = this.normalizeName(input.name);
    if (name !== instrument.name) {
      await this.ensureNameIsAvailable(name);
    }
    await this.ensureCategoryExists(input.categoryId);

    const updated = await this.instrumentsRepository.update(
      id,
      name,
      input.categoryId,
    );
    return this.toResponse(updated);
  }

  async delete(id: string): Promise<InstrumentResponseDto> {
    const instrument = await this.instrumentsRepository.findById(id);
    if (!instrument) {
      throw new NotFoundException('Instrument not found');
    }

    const deleted = await this.instrumentsRepository.delete(id);
    return this.toResponse(deleted);
  }

  private async ensureNameIsAvailable(name: string): Promise<void> {
    const existing = await this.instrumentsRepository.findByName(name);
    if (existing) {
      throw new ConflictException('Instrument already exists');
    }
  }

  private async ensureCategoryNameIsAvailable(name: string): Promise<void> {
    const existing = await this.instrumentsRepository.findCategoryByName(name);
    if (existing) {
      throw new ConflictException('Instrument category already exists');
    }
  }

  private async ensureCategoryExists(categoryId: string): Promise<void> {
    const category = await this.instrumentsRepository.findCategoryById(
      categoryId,
    );
    if (!category) {
      throw new NotFoundException('Instrument category not found');
    }
  }

  private normalizeName(name: string): string {
    const normalized = name.trim().toLowerCase();
    if (normalized.length === 0) {
      throw new BadRequestException('name cannot be empty');
    }

    return normalized;
  }

  private toCategoryResponse(
    category: InstrumentCategory,
  ): InstrumentCategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
    };
  }

  private toResponse(instrument: InstrumentWithCategory): InstrumentResponseDto {
    return {
      id: instrument.id,
      name: instrument.name,
      categoryId: instrument.categoryId,
      category: this.toCategoryResponse(instrument.category),
    };
  }
}
