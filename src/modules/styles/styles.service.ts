import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Style } from '@prisma/client';
import { CreateStyleDto } from './dto/create-style.dto';
import {
  ListStylesResponseDto,
  StyleResponseDto,
} from './dto/style-response.dto';
import { UpdateStyleDto } from './dto/update-style.dto';
import { StylesRepository } from './styles.repository';

@Injectable()
export class StylesService {
  constructor(private readonly stylesRepository: StylesRepository) {}

  async list(): Promise<ListStylesResponseDto> {
    const styles = await this.stylesRepository.findAll();

    return {
      items: styles.map((style) => this.toResponse(style)),
      total: styles.length,
    };
  }

  async create(input: CreateStyleDto): Promise<StyleResponseDto> {
    const name = this.normalizeName(input.name);
    await this.ensureNameIsAvailable(name);

    const created = await this.stylesRepository.create(name);
    return this.toResponse(created);
  }

  async update(id: string, input: UpdateStyleDto): Promise<StyleResponseDto> {
    const style = await this.stylesRepository.findById(id);
    if (!style) {
      throw new NotFoundException('Style not found');
    }

    const name = this.normalizeName(input.name);
    if (name !== style.name) {
      await this.ensureNameIsAvailable(name);
    }

    const updated = await this.stylesRepository.update(id, name);
    return this.toResponse(updated);
  }

  async delete(id: string): Promise<StyleResponseDto> {
    const style = await this.stylesRepository.findById(id);
    if (!style) {
      throw new NotFoundException('Style not found');
    }

    const deleted = await this.stylesRepository.delete(id);
    return this.toResponse(deleted);
  }

  private async ensureNameIsAvailable(name: string): Promise<void> {
    const existing = await this.stylesRepository.findByName(name);
    if (existing) {
      throw new ConflictException('Style already exists');
    }
  }

  private normalizeName(name: string): string {
    const normalized = name.trim().toLowerCase();
    if (normalized.length === 0) {
      throw new BadRequestException('name cannot be empty');
    }

    return normalized;
  }

  private toResponse(style: Style): StyleResponseDto {
    return {
      id: style.id,
      name: style.name,
    };
  }
}
