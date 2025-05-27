import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findOneByPhone(phone: string) {
    return this.prisma.user.findUnique({ where: { phone } });
  }

  async findMany() {
    return this.prisma.user.findMany({});
  }

  async findUser(id: string) {
    const user = this.prisma.user.findUnique({
      where: { id },
    });

    return user;
  }
  async checkEmail(email: string) {
    console.log(email);

    const user = await this.prisma.user.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
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
