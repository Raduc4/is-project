import { FlightType } from "@prisma/client";
import { IsNotEmpty, IsString } from "class-validator";

export class SearchFlightDto {
  @IsNotEmpty()
  @IsString()
  from: string;
  @IsNotEmpty()
  @IsString()
  to: string;
  type: FlightType;
  @IsNotEmpty()
  departureDate: Date;
  @IsNotEmpty()
  arrivalDate: Date;
}
