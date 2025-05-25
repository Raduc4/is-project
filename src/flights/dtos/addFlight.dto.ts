import { FlightData, FlightType } from '@prisma/client';

export class CreateFlightDto {
  flightCode: string;
  planeId: string;
  departureLocationId: string;
  arrivalLocationId: string;
  departureDate: Date;
  arrivalDate: Date;

  flightData: FlightData;
}
