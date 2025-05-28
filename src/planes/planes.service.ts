import { Injectable } from '@nestjs/common';
import { CreatePlaneDto } from './dtos/createPlane.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlanesService {

  constructor(private readonly prismaService: PrismaService) {}
  
  async create(planeData: CreatePlaneDto) {
   return this.prismaService.plane.create({
      data: {
        planeModel: planeData.planeModel,
      },
    });
  }
}
