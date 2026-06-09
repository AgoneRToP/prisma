import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dtos/register.dto';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: RegisterDto): Promise<any> {
    const existing = await this.prisma.user.findUnique({
      where: {
        email: payload.email.toLowerCase(),
      },
    });

    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: payload.name,
        age: payload.age,
        email: payload.email.toLowerCase(),
        password: hashedPassword,
      },
    });

    const { password, ...result } = user;

    return {
      success: true,
      data: user,
    };
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id || user.userId,
    };

    return {
      success: true,
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id || user.userId,
        email: user.email,
        name: user.name,
      },
    };
  }

  async googleAuth(user:{email:string,name:string}) {

    let existing = await this.prisma.user.upsert({
      where:{email:user.email},
      update:{},
      create:{
        email:user.email,
        name:user.name
      }
    });

    const {password: _, ...res} = existing
    return res
    // if (!existing) {
    //   existing = await this.prisma.user.create({
    //     data: {
    //       name: user?.displayName,
    //       email: user.emails?.[0]?.value,
    //     },
    //   });
    // }

  
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user) {
      return null;
    }

    if (!user.password) {
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
}
