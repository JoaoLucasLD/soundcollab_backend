import { Injectable } from '@nestjs/common';
import { Style } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class StylesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Style[]> {
    return this.prisma.style.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  findById(id: string): Promise<Style | null> {
    return this.prisma.style.findUnique({
      where: { id },
    });
  }

  findByName(name: string): Promise<Style | null> {
    return this.prisma.style.findUnique({
      where: { name },
    });
  }

  create(name: string): Promise<Style> {
    return this.prisma.style.create({
      data: { name },
    });
  }

  update(id: string, name: string): Promise<Style> {
    return this.prisma.style.update({
      where: { id },
      data: { name },
    });
  }

  delete(id: string): Promise<Style> {
    return this.prisma.style.delete({
      where: { id },
    });
  }
}
