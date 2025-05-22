import { FlightType } from "@prisma/client";

export interface IFlight {
  _id?: string;
  flightCode: string;
  planeId: string;
  departureLocation: string;
  arrivalLocation: string;
  flightType: FlightType;
  departureDate: Date;
  arrivalDate: Date;
}