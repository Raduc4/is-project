import { FlightType } from "@prisma/client";
import { IFlight } from "../interfaces/flight.interface";

export class FlightEntity implements IFlight {
  _id?: string;
  flightCode: string;
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
    classOneBookedSeats: number;
    classEconomyBookedSeats: number;
    classBusinessBookedSeats: number;
    flightType: FlightType;
  };

  constructor(flight: IFlight) {
    const {
      planeId,
      departureLocationId,
      arrivalLocationId,
      departureDate,
      arrivalDate,
      flightData,
    } = flight;
    this.flightCode = this.generateFlightCode();
    this.planeId = planeId;
    this.departureLocationId = departureLocationId;
    this.arrivalLocationId = arrivalLocationId;
    this.departureDate = departureDate;
    this.arrivalDate = arrivalDate;
    this.flightData = {
      ...flightData,
      classBusinessBookedSeats: 0,
      classEconomyBookedSeats: 0,
      classOneBookedSeats: 0,
    };
  }

  generateFlightCode(): string {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `FL-${randomCode}`;
  }
}
