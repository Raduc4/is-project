import { Injectable } from "@nestjs/common";
import { CreateFlightDto } from "./dtos/addFlight.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { FlightEntity } from "./entities/flight.entity";
import { SearchFlightDto } from "./dtos/searchFlight.dto";
import { Flight } from "@prisma/client";

@Injectable()
export class FlightsService {
  constructor(private readonly prismaService: PrismaService) {}

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

  validateCashPayment(id: string) {
    return this.prismaService.payments.update({
      where: { id, paymentType: "CASH" },
      data: {
        status: "VALIDATED",
      },
    });
  }

  async searchFlight(searchLocations: SearchFlightDto): Promise<Flight[]> {
    const { departureDate, arrivalDate, type, to, from, flightId } =
      searchLocations;
    return this.prismaService.flight.findMany({
      where: {
        arrivalDate: arrivalDate,
        departureDate: departureDate,
        departureLocationId: from,
        arrivalLocationId: to,
        flightData: {
          flightId: flightId,
          flightType: type,
        },
      },
      take: 10,
    });
  }
}
