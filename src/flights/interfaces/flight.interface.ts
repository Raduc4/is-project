import { FlightType } from "@prisma/client";

export interface IFlight {
  _id?: string;
  planeId: string;
  departureLocationId: string;
  arrivalLocationId: string;
  departureDate: Date;
  arrivalDate: Date;
  flightData: {
    id: string;
    flightId: string;
    classOneSeatsNr: number;
    classEconomySeatsNr: number;
    classBusinessSeatsNr: number;
    flightType: FlightType;
  };
}
