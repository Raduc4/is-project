import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../auth/entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  public async createUser(user: UserEntity) {
    console.log('Creating user', user);
    const newUser = this.prismaService.user.create({
      data: {
        email: user.email,
        phone: user.phone,
        passwordHash: user.passwordHash,
        confirmationCode: Math.floor(Math.random() * 10000),
        role: user.role,
      },
    });
    return newUser;
  }

  public async updatePassword(user: UserEntity) {
    const updatedUser = this.prismaService.user.update({
      where: { email: user.email, phone: user.phone },
      data: { passwordHash: user.passwordHash },
    });
    return updatedUser;
  }

  async getTokens(userId: string, role: 'USER' | 'ADMIN') {
    const jwtPayload: IJwtPayload = {
      id: userId,
      role,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('JWT_SECRET'),
        expiresIn: '3d',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('JWT_SECRET_RT'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async findUserByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      return user;
    }
  }

  async findOneByPhone(phone: string) {
    console.log('Find unique', phone);
    return this.prismaService.user.findUnique({ where: { phone } });
  }

  async findUserById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    if (user) {
      return user;
    }
  }
}
