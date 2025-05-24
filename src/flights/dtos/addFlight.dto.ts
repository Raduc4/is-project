import { FlightData, FlightType } from '@prisma/client';

export class CreateFlightDto {
  flightCode: string;
  planeId: string;
  departureLocation: string;
  arrivalLocation: string;
  departureDate: Date;
  arrivalDate: Date;

  flightData: FlightData;
}
