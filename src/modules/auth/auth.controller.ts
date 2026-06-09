import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Req,
  Res,
  Render,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { GoogleAuthGuard } from './guards/google.guard';
import { LoginDto } from './dtos/login.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Get('register')
  @Render('register')
  showRegisterPage() {
    return {};
  }

  @Post('register')
  async register(@Body() payload: RegisterDto) {
    return await this.service.register(payload);
  }

  @Get('login')
  @Render('login')
  showLoginPage() {
    return {};
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any, @Body() payload: LoginDto) {
    return this.service.login(req.user);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('/google')
  async google() {}

  @UseGuards(GoogleAuthGuard)
  @Get('/google/callback')
  async googleCallback(@Req() req: any, @Res() res: Response) {
    const response = await this.service.googleAuth(req.user);

    res.redirect('/products?lang=рус');
  }
}
