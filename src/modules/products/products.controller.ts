import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Render,
  Res,
  ParseIntPipe,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos';
import type { Response } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  @Render('products-list')
  async getAll(@Query('lang') lang: string = 'русский') {
    const result = await this.service.getAll();

    const localizedProducts = result.data.map((product) => {
      const nameObj = product.name as Record<string, string> | null;
      const descObj = product.description as Record<string, string> | null;

      return {
        id: product.id,
        price: product.price,
        quantity: product.quantity,
        name: nameObj?.[lang] || nameObj?.['english'] || '—',
        description: descObj?.[lang] || descObj?.['english'] || '—',
      };
    });

    const translations: Record<string, Record<string, string>> = {
      eng: {
        title: '📦 Product Management',
        thId: 'ID',
        thName: 'Name',
        thDesc: 'Description',
        thPrice: 'Price',
        thQty: 'Quantity',
        thActions: 'Actions',
        btnEdit: 'Edit',
        unit: 'pcs.',
      },
      рус: {
        title: '📦 Управление товарами',
        thId: 'ID',
        thName: 'Название',
        thDesc: 'Описание',
        thPrice: 'Цена',
        thQty: 'Количество',
        thActions: 'Действия',
        btnEdit: 'Редактировать',
        unit: 'шт.',
      },
      uzb: {
        title: '📦 Mahsulotlarni boshqarish',
        thId: 'ID',
        thName: 'Nomi',
        thDesc: 'Tavsif',
        thPrice: 'Narxi',
        thQty: 'Soni',
        thActions: 'Amallar',
        btnEdit: 'Tahrirlash',
        unit: 'dona',
      },
      узб: {
        title: '📦 Маҳсулотларни бошқариш',
        thId: 'ID',
        thName: 'Номи',
        thDesc: 'Тавсиф',
        thPrice: 'Нархи',
        thQty: 'Сони',
        thActions: 'Амаллар',
        btnEdit: 'Таҳрирлаш',
        unit: 'дона',
      },
    };

    const ui = translations[lang] || translations['рус'];

    return {
      products: localizedProducts,
      ui,
    };
  }

  @Get(':id/edit')
  @Render('edit-product')
  async editPage(@Param('id', ParseIntPipe) id: number) {
    const result = await this.service.update({} as any, id);
    const product = await this.service
      .getAll()
      .then((res) => res.data.find((p) => p.id === id));
    return { product };
  }

  @Post(':id/update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: CreateProductDto,
    @Res() res: Response,
  ) {
    payload.price = Number(payload.price);
    payload.quantity = Number(payload.quantity);

    await this.service.update(payload, id);
    return res.redirect('/products');
  }

  @Get(':id/delete')
  async delete(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.service.delete(id);
    return res.redirect('/products');
  }

  @Get(':id/client')
  async getProductForClient(
    @Param('id', ParseIntPipe) id: number,
    @Query('lang') lang: string = 'рус',
  ) {
    const result = await this.service.getOne(id);
    const product = result.data;

    if (!product) {
      throw new NotFoundException(`Товар с ID ${id} не найден`);
    }

    const nameObj = product.name as Record<string, string> | null;
    const descObj = product.description as Record<string, string> | null;

    return {
      id: product.id,
      price: product.price,
      quantity: product.quantity,
      name: nameObj?.[lang] || nameObj?.['eng'] || '',
      description: descObj?.[lang] || descObj?.['eng'] || '',
    };
  }
}
