import { FlightData, Weekday } from "@prisma/client";

export class CreateFlightDto {
  planeId: string;
  departureLocationId: string;
  arrivalLocationId: string;
  departureDate: Date;
  arrivalDate: Date;

  //if regular days are provided, the flight is considered regular
  regularDays?: Weekday[];
  regularTime?: string;

  seasonStart?: Date;
  seasonEnd?: Date;

  flightData: Omit<
    FlightData,
    | "classOneBookedSeats"
    | "classEconomyBookedSeats"
    | "classBusinessBookedSeats"
  >;
}
