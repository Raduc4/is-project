import { FlightType } from "@prisma/client";
import { IFlight } from "../interfaces/flight.interface";

export class FlightEntity implements IFlight{
  _id?: string;
  flightCode: string;
      planeId: string;
      departureLocation: string;
      arrivalLocation: string;
      flightType: FlightType;
      departureDate: Date;
      arrivalDate: Date;

  constructor(flight: IFlight) {
    const {
      _id,
      flightCode,
      planeId,
      departureLocation,
      arrivalLocation,
      flightType,
      departureDate,
      arrivalDate,
    } = flight;
    this._id = _id;
    this.flightCode = flightCode;
    this.planeId = planeId;
    this.departureLocation = departureLocation;
    this.arrivalLocation = arrivalLocation;
    this.flightType = flightType;
    this.departureDate = departureDate;
    this.arrivalDate = arrivalDate; 
  }

  
}
