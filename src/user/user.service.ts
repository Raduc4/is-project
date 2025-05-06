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

  async bulkBusinessInformationUpdate(
    id: string,
    businessInfor: BusinessInfoDto,
  ) {
    const {
      businessName,
      businessAddress,
      businessEmail,
      businessPostCode,
      businessDescription,
    } = businessInfor;
    await this.prisma.user.update({
      where: { id },
      data: {
        businessName,
        businessAddress,
        businessEmail,
        businessPostCode,
        businessDescription,
      },
    });
  }
  async updateProfilePicture(userId: string, base64: string, type: string) {
    return await this.s3Service
      .uploadFile(base64, type, userId)
      .then(async (imageObject) => {
        console.log('Image object', imageObject);

        return await this.prisma.user.update({
          where: { id: userId },
          data: {
            avatar: imageObject.Location,
          },
        });
      });
  }

  async updateBusinessName(userId: string, businessName: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        businessName,
      },
    });
  }

  async updateBusinessAddress(userId: string, businessAddress: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        businessAddress,
      },
    });
  }
  async updateBusinessEmail(userId: string, businessEmail: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        businessEmail,
      },
    });
  }
  async updateBusinessPostCode(userId: string, businessPostCode: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        businessPostCode,
      },
    });
  }

  async updateBusinessDescription(userId: string, businessDescription: string) {
    console.log('Business description', businessDescription);
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        businessDescription,
      },
    });
  }

  async updateBusinessPhone(userId: string, businessPhone: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        businessPhone,
      },
    });
  }
}
