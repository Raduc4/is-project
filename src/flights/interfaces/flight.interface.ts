import { FlightType, Weekday } from "@prisma/client";

export interface IFlight {
  _id?: string;
  planeId: string;
  departureLocationId: string;
  arrivalLocationId: string;
  departureDate: Date;
  arrivalDate: Date;
  seasonStart?: Date;
  seasonEnd?: Date;
  regularDays: Weekday[]; // Array of strings representing days of the week
  regularTime: string; // ISO 8601 time format
  flightData: {
    id: string;
    flightId: string;
    classOneSeatsNr: number;
    classEconomySeatsNr: number;
    classBusinessSeatsNr: number;
    flightType: FlightType;
  };
}
