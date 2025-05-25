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
    date: Date;
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
      flightCode,
      planeId,
      departureLocationId,
      arrivalLocationId,
      departureDate,
      arrivalDate,
      flightData,
    } = flight;
    this.flightCode = flightCode;
    this.planeId = planeId;
    this.departureLocationId = departureLocationId;
    this.arrivalLocationId = arrivalLocationId;
    this.departureDate = departureDate;
    this.arrivalDate = arrivalDate;
    this.flightData = flightData;
  }
}
