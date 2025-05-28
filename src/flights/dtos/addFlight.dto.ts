import { FlightData, FlightType } from "@prisma/client";

export class CreateFlightDto {
  planeId: string;
  departureLocationId: string;
  arrivalLocationId: string;
  departureDate: Date;
  arrivalDate: Date;

  flightData: Omit<
    FlightData,
    | "classOneBookedSeats"
    | "classEconomyBookedSeats"
    | "classBusinessBookedSeats"
  >;
}
