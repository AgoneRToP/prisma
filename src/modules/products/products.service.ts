import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dtos';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return {
      success: true,
      data: await this.prisma.product.findMany(),
    };
  }

  async create(payload: CreateProductDto) {
    const product = await this.prisma.product.create({ data: payload });

    return {
      success: true,
      data: product,
    };
  }

  async update(payload: CreateProductDto, id: number) {
    const product = await this.prisma.product.update({
      where: { id },
      data: payload,
    });

    return {
      success: true,
      data: product,
    };
  }

  async delete(id: number) {
    await this.prisma.product.delete({ where: { id } });

    return {
      success: true,
    };
  }
}