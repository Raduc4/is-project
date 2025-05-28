import { Injectable } from '@nestjs/common';
import { CreatePlaneDto } from './dtos/createPlane.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlanesService {
  constructor(private readonly prismaService: PrismaService) {}
  generatePlaneCode(): string {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `P-${randomCode}`;
  }

  async find(planeCode: string) {
    return this.prismaService.plane.findFirst({
      where: { planeCode: { contains: planeCode } },
    });
  }

  async create(planeData: CreatePlaneDto) {
    return this.prismaService.plane.create({
      data: {
        planeModel: planeData.planeModel,
        planeCode: this.generatePlaneCode(),
      },
    });
  }
}
