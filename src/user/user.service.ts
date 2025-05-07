import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImagesService } from 'src/s3/s3.service';
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private s3Service: ImagesService,
  ) {}

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findOneByPhone(phone: string) {
    return this.prisma.user.findUnique({ where: { phone } });
  }

  async findFacebookUser(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }
  async findMany() {
    return this.prisma.user.findMany({});
  }

  async getSavedEvents(id: string) {
    const events = await this.prisma.user.findUnique({
      where: { id },
      include: { savedTickets: true },
    });

    return events.savedTickets;
  }

  async findUser(id: string) {
    const user = this.prisma.user.findUnique({
      where: { id },
      include: { tickets: true },
    });

    return user;
  }
  async checkEmail(email: string) {
    console.log(email);

    const user = await this.prisma.user.findFirst({
      where: {
        email: { equals: email, mode: 'insensitive' },
      },
    });

    if (user) {
      return {
        status: true,
      };
    } else {
      return {
        status: false,
      };
    }
  }
}
