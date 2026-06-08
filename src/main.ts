import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
import hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.setBaseViewsDir(join(process.cwd(), 'views')); 
  app.setViewEngine('hbs');

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  hbs.registerHelper('getTranslation', (nameObj: any, lang: string) => {
    return nameObj[lang] || nameObj['eng']
  });

  hbs.registerHelper('isEquel', (price: number) => {
    return price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
bootstrap();
