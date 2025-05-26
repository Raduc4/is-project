import { FlightType } from "@prisma/client";

export class SearchFlightDto {
  from: string;
  to: string;
  type: FlightType;
  departureDate: Date;
  arrivalDate: Date;
  flightId: string;
}
