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
    paymentMethod: "card" | "cash" | "cache";
    extras?: {
      meal?: boolean;
      extraLuggage?: boolean;
    };
  }) {
    const {
      ticketType,
      quantity,
      isRoundTrip = false,
      paymentMethod,
      extras = {},
    } = data;

    const basePrices: Record<typeof ticketType, number> = {
      economy: 100,
      business: 200,
      firstClass: 300,
    };
    const base = basePrices[ticketType];

    let pricePerTicket = base;
    if (extras.meal) pricePerTicket *= 1.05;
    if (extras.extraLuggage) pricePerTicket *= 1.05;

    let total = pricePerTicket * quantity;

    if (isRoundTrip) total *= 0.95;

    return {
      totalPrice: Math.round(total * 100) / 100,
      currency: "EUR",
      paymentMethod: paymentMethod.toLowerCase() === "card" ? "Card" : "Cash",
      roundTripDiscountApplied: isRoundTrip,
    };
  }
  async createTicket(dto: CreateTicketDto) {
    let discountPercent = dto.discountPercent;

    if (
      (!discountPercent || discountPercent == 0) &&
      dto.ticketType === "ROUND_TRIP"
    ) {
      discountPercent = 5;
    }

    if (
      (!discountPercent || discountPercent === 0) &&
      dto.ticketPurchaseType === "LAST_MINUTE"
    ) {
      discountPercent = 40;
    }
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
        location: dto.location,
        description: dto.description,
        dateFrom: new Date(dto.dateFrom),
        dateTo: new Date(dto.dateTo),

        adults: dto.adults,
        children: dto.children,
        seniors: dto.seniors,
        withMeal: dto.withMeal,
        extraBaggage: dto.extraBaggage,
        optionsFeeCents: dto.optionsFeeCents,
        discountPercent: discountPercent,
        currency: dto.currency,
        returnFlightId: dto.returnFlightId,
        paymentId: dto.paymentId,
      },
    });
  }
}
