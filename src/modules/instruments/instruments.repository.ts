import { Injectable } from '@nestjs/common';
import { Instrument, InstrumentCategory } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

export type InstrumentWithCategory = Instrument & {
  category: InstrumentCategory;
};

@Injectable()
export class InstrumentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<InstrumentWithCategory[]> {
    return this.prisma.instrument.findMany({
      include: { category: true },
      orderBy: [{ category: { name: 'asc' } }, { name: 'asc' }],
    });
  }

  findCategories(): Promise<InstrumentCategory[]> {
    return this.prisma.instrumentCategory.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  findCategoryById(id: string): Promise<InstrumentCategory | null> {
    return this.prisma.instrumentCategory.findUnique({
      where: { id },
    });
  }

  findCategoryByName(name: string): Promise<InstrumentCategory | null> {
    return this.prisma.instrumentCategory.findUnique({
      where: { name },
    });
  }

  createCategory(name: string): Promise<InstrumentCategory> {
    return this.prisma.instrumentCategory.create({
      data: { name },
    });
  }

  updateCategory(id: string, name: string): Promise<InstrumentCategory> {
    return this.prisma.instrumentCategory.update({
      where: { id },
      data: { name },
    });
  }

  deleteCategory(id: string): Promise<InstrumentCategory> {
    return this.prisma.instrumentCategory.delete({
      where: { id },
    });
  }

  countInstrumentsByCategoryId(categoryId: string): Promise<number> {
    return this.prisma.instrument.count({
      where: { categoryId },
    });
  }

  findById(id: string): Promise<InstrumentWithCategory | null> {
    return this.prisma.instrument.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  findByName(name: string): Promise<Instrument | null> {
    return this.prisma.instrument.findUnique({
      where: { name },
    });
  }

  create(name: string, categoryId: string): Promise<InstrumentWithCategory> {
    return this.prisma.instrument.create({
      data: { name, categoryId },
      include: { category: true },
    });
  }

  update(
    id: string,
    name: string,
    categoryId: string,
  ): Promise<InstrumentWithCategory> {
    return this.prisma.instrument.update({
      where: { id },
      data: { name, categoryId },
      include: { category: true },
    });
  }

  delete(id: string): Promise<InstrumentWithCategory> {
    return this.prisma.instrument.delete({
      where: { id },
      include: { category: true },
    });
  }
}
