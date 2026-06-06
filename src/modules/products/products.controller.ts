import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  async getAll() {
    return await this.service.getAll();
  }

  @Post()
  async create(@Body() payload: CreateProductDto) {
    return await this.service.create(payload);
  }

  @Put(':id')
  async update(@Body() payload: CreateProductDto, @Body('id') id: number) {
    return await this.service.update(payload, id);
  }

  @Delete(':id')
  async delete(@Body('id') id: number) {
    return await this.service.delete(id);
  }
}
