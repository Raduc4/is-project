import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export interface CreateTicketDto {
  passengerName: string;
  phone: string;
  outboundFlightId: string;
  seatClass: "ECONOMY" | "BUSINESS" | "FIRST";
  basePrice: number;
  totalPrice: number;
  ticketType: "ONE_WAY" | "ROUND_TRIP";
  ticketPurchaseType: "REGULAR" | "LAST_MINUTE" | "ROUND_TRIP";
  location: string;
  description: string;
  dateFrom: string | Date; // ISO-8601 or Date
  dateTo: string | Date;
  // optional overrides
  adults?: number;
  children?: number;
  seniors?: number;
  withMeal?: boolean;
  extraBaggage?: boolean;
  optionsFeeCents?: number;
  discountPercent?: number;
  currency?: string;
  returnFlightId?: string;
  paymentId?: string;
}
