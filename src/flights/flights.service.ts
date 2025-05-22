import { Injectable } from '@nestjs/common';
import { CreateFlightDto } from './dtos/addFlight.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FlightsService {
  constructor(private readonly prismaService: PrismaService) {}

  async addFlight(flightDto: CreateFlightDto) {
    return {
      status: true,
      message: 'Flight added successfully',
    };
  }

  async deleteFlight(id: string) {
    return this.prismaService.flight.delete({
      where: { id },
    });
  }
}
