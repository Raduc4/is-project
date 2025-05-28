import { Injectable } from '@nestjs/common';
import { GisNode } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGisNodeDto } from "./dtos/createGisNode.dto";

@Injectable()
export class GisNodeService {
  constructor(private readonly prisma: PrismaService) {}

  async searchGisNode(gisNodeName: string): Promise<GisNode[]> {
    return this.prisma.gisNode.findMany({
      where: {
        OR: [
          { name: { contains: gisNodeName } },
          { uname: { contains: gisNodeName } },
        ],
      },
    });
  }

  async create(gisNode: CreateGisNodeDto): Promise<GisNode> {
    return this.prisma.gisNode.create({
      data: {
        name: gisNode.name,
        uname: gisNode.uname.toUpperCase(),
      },
    });
  }
}
