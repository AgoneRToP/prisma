import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller()
export class AppController {
  
  @Get()
  async handleRoot(
    @Query('userId') userId: string,
    @Res() res: Response
  ) {
    return res.redirect('/products');
  }
}
