import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTicketDto } from "./dtos/createTicketDto";

@Injectable()
export class TicketsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findTicket(id: string) {
    return await this.prismaService.ticket.findUnique({ where: { id } });
  }
  async searchTicket(title: string) {
    return this.prismaService.ticket.findMany({
      where: {},
      take: 10,
    });
  }

  async deleteTicket(id: string) {
    return await this.prismaService.ticket.delete({ where: { id } });
  }

  async getAllTickets() {
    return await this.prismaService.ticket.findMany({ take: 10 });
  }

  async calculatePrice(data: {
    ticketType: "economy" | "business" | "firstClass";
    quantity: number;
    isRoundTrip?: boolean;
    isLastMinute?: boolean;
    paymentMethod?: "card" | "cash" | "cache";
    extras?: {
      meal?: boolean;
      extraLuggage?: boolean;
    };
  }) {
    console.log("Received data:", data); // Debug incoming data

    const {
      ticketType,
      quantity,
      isRoundTrip = false,
      isLastMinute = false,
      paymentMethod = "card",
      extras = {
        meal: false,
        extraLuggage: false,
      },
    } = data;

    console.log("Processing with:", {
      ticketType,
      quantity: Number(quantity),
      isRoundTrip,
      isLastMinute,
      paymentMethod,
    }); // Debug processed data

    // Ensure quantity is a number
    const quantityNum = Number(quantity);

    if (isNaN(quantityNum)) {
      console.error("Invalid quantity:", quantity);
      return {
        totalPrice: null,
        currency: "EUR",
        paymentMethod:
          paymentMethod && paymentMethod.toLowerCase() === "card"
            ? "Card"
            : "Cash",
        roundTripDiscountApplied: isRoundTrip,
        error: "Invalid quantity",
      };
    }

    const basePrices: Record<string, number> = {
      economy: 100,
      business: 200,
      firstClass: 300,
    };

    // Check if ticketType is valid
    if (!basePrices[ticketType]) {
      console.error("Invalid ticketType:", ticketType);
      return {
        totalPrice: null,
        currency: "EUR",
        paymentMethod:
          paymentMethod && paymentMethod.toLowerCase() === "card"
            ? "Card"
            : "Cash",
        roundTripDiscountApplied: isRoundTrip,
        error: "Invalid ticket type",
      };
    }

    let pricePerTicket = basePrices[ticketType];

    // Ensure extras are correctly handled
    const mealSelected = extras && extras.meal === true;
    const extraLuggageSelected = extras && extras.extraLuggage === true;

    if (mealSelected) pricePerTicket *= 1.05;
    if (extraLuggageSelected) pricePerTicket *= 1.05;

    console.log("Price per ticket:", pricePerTicket); // Debug price per ticket

    let total = pricePerTicket * quantityNum;

    if (isRoundTrip) total *= 0.95;
    if (isLastMinute) total *= 0.6;

    console.log("Total before rounding:", total); // Debug total

    const paymentDisplay =
      paymentMethod && paymentMethod.toLowerCase() === "card" ? "Card" : "Cash";

    return {
      totalPrice: Math.round(total * 100) / 100,
      currency: "EUR",
      paymentMethod: paymentDisplay,
      roundTripDiscountApplied: isRoundTrip,
    };
  }
  async createTicket(dto: CreateTicketDto) {
    return this.prismaService.ticket.create({
      data: {
        passengerName: dto.passengerName,
        phone: dto.phone,
        outboundFlightId: dto.outboundFlightId,
        seatClass: dto.seatClass,
        basePriceCents: dto.basePrice,
        totalPriceCents: dto.totalPrice,
        ticketType: dto.ticketType,
        ticketPurchaseType: dto.ticketPurchaseType,
        dateFrom: new Date(dto.dateFrom),
        dateTo: new Date(dto.dateTo),

        adults: dto.adults,
        children: dto.children,
        seniors: dto.seniors,
        withMeal: dto.withMeal,
        extraBaggage: dto.extraBaggage,
        optionsFeeCents: dto.optionsFeeCents,
        discountPercent: dto.discountPercent,
        currency: dto.currency,
        returnFlightId: dto.returnFlightId,
        paymentId: dto.paymentId,
      },
    });
  }
}
