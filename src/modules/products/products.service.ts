import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    return {
      success: true,
      data: product,
    };
  }

  async create(payload: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        ...payload,
        name: payload.name as any,
        description: payload.description as any,
      },
    });

    return {
      success: true,
      data: product,
    };
  }

  async update(payload: CreateProductDto, id: number) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...payload,
        name: payload.name as any,
        description: payload.description as any,
      },
    });

    return {
      success: true,
      data: product,
    };
  }

  async delete(id: number) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.prisma.product.delete({ where: { id } });

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  }
}
