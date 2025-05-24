import { FlightType } from '@prisma/client';

export interface IFlight {
  _id?: string;
  flightCode: string;
  planeId: string;
  departureLocation: string;
  arrivalLocation: string;
  departureDate: Date;
  arrivalDate: Date;
  flightData: {
    id: string;
    flightId: string;
    date: Date;
    classOneSeatsNr: number;
    classEconomySeatsNr: number;
    classBusinessSeatsNr: number;
    classOneBookedSeats: number;
    classEconomyBookedSeats: number;
    classBusinessBookedSeats: number;
    flightType: FlightType;
  };
}
