import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(payload: RegisterDto): Promise<any> {
    const existing = await this.prisma.user.findUnique({
      where: {
        email: payload.email.toLowerCase(),
      },
    });

    if (existing) {
      throw new Error('User already exists');
    }

    const data = await this.prisma.user.create({
      data: {
        name: payload.name,
        age: payload.age,
        email: payload.email.toLowerCase(),
        password: payload.password,
      },
    });

    return {
      success: true,
      data,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = { id: 1, email: email };
    return user;
  }
}
