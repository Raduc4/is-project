import { Injectable } from '@nestjs/common';
import { CreateFlightDto } from './dtos/addFlight.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FlightEntity } from './entities/flight.entity';

@Injectable()
export class FlightsService {
  constructor(private readonly prismaService: PrismaService) {}

  async addFlight(flightDto: CreateFlightDto) {
    const flightEntity = new FlightEntity(flightDto);
    return this.prismaService.flight.create({
      data: {
        ...flightEntity,
        flightData: {
          create: {
            ...flightEntity.flightData,
          },
        },
      },
    });
  }

  async deleteFlight(id: string) {
    return this.prismaService.flight.delete({
      where: { id },
    });
  }

  // async searchFlight(searchLocations: SearchFlightsDto) {
  //   const { departureLocation, arrivalLocation } = searchLocations;
  //   return this.prismaService.flight.findMany({
  //     where: { title: { contains: title, mode: 'insensitive' } },
  //     take: 10,
  //   });
  // }
}
