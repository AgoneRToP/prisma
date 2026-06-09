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

  // async login(user: any) {
  //   const payload = { username: user.username, sub: user.userId };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }

  async googleAuth(user: any) {
    const googleId = user?.id;

    let existing = await this.prisma.user.findFirst({ where: { googleId }})

    if(!existing) {
      existing = await this.prisma.user.create({
        data: {
          name: user?.displayName,
          email: user.emails?.[0]?.value
        }
      })
    }

    return {
      user: existing
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = { id: 1, email: email };
    return user;
  }
}
