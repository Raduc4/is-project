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
    const newUser = this.prismaService.user.create({
      data: {
        email: user.email,
        phone: user.phone,
        enabled: false,
        username: user.username,
        passwordHash: user.passwordHash,
        isCodeUsed: false,
        confirmationCode: Math.floor(Math.random() * 10000),
        facebookOauth: false,
        appleOauth: false,
        avatar: '',
        savedEvents: {},
        role: user.role,
        businessName: user.businessName,
        businessAddress: user.businessAddress,
        businessPhone: user.businessPhone,
        businessPostCode: user.businessPostCode,
        businessDescription: user.businessDescription,
        businessCategory: user.businessCategory,
        businessTags: user.businessTags,
      },
    });
    return newUser;
  }

  public async updatePassword(user: UserEntity) {
    console.log('User entity', user);
    const updatedUser = this.prismaService.user.update({
      where: { email: user.email, phone: user.phone },
      data: { passwordHash: user.passwordHash },
    });
    return updatedUser;
  }

  // async updateRtHash(user: UserEntity) {
  //   this.prismaService.user.update({
  //     where: { id: user._id },
  //     data: { rtHash: user.rtHash },
  //   });
  // }

  async getTokens(userId: string, role: 'USER' | 'BUSINESS') {
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
