import { Injectable } from "@nestjs/common";
import { CreateFlightDto } from "./dtos/addFlight.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { FlightEntity } from "./entities/flight.entity";
import { SearchFlightDto } from "./dtos/searchFlight.dto";
import { Flight } from "@prisma/client";
import { startOfDay, addDays } from "date-fns";

@Injectable()
export class FlightsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllFlights() {
    return this.prismaService.flight.findMany({
      include: {
        flightData: true,
        departureLocation: true,
        arrivalLocation: true,
      },
    });
  }

  async addFlight(flightDto: CreateFlightDto) {
    const flightEntity = new FlightEntity(flightDto);
    return this.prismaService.flight.create({
      data: {
        ...flightEntity,
        arrivalLocationId: flightDto.arrivalLocationId,
        departureLocationId: flightDto.departureLocationId,
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


  async searchFlight(search: SearchFlightDto): Promise<Flight[]> {
    const { departureDate, to, from } = search;

    const depStart = startOfDay(new Date(departureDate));
    const depEnd = addDays(depStart, 1); // 24 h later
    // const arrStart = startOfDay(new Date(arrivalDate));
    // const arrEnd = addDays(arrStart, 1);

    return this.prismaService.flight.findMany({
      include: {
        flightData: true,
        departureLocation: true,
        arrivalLocation: true,
      },
      where: {
        departureLocation: {
          name: from,
        },
        arrivalLocation: {
          name: to,
        },
        departureDate: { gte: depStart, lt: depEnd },
        // arrivalDate: { gte: arrStart, lt: arrEnd },
      },
      take: 10,
    });
  }
}
