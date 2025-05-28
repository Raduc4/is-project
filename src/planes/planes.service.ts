import { Injectable } from '@nestjs/common';
import { CreatePlaneDto } from './dtos/createPlane.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlanesService {
  constructor(private readonly prismaService: PrismaService) {}
  generatePlaneCode(): string {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${randomCode}`;
  }

  async find(planeCode: string) {
    return this.prismaService.plane.findMany({
      where: {
        planeCode: {
          startsWith: planeCode,
          mode: "insensitive",
        },
      },
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
