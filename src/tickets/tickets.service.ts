import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto } from './dtos/createTicketDto';

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

  async bookTicket(eventId: string, userId: string) {}

  async calculatePrice(data: any) {
    const {
      ticketType,
      quantity,
      isRoundTrip,
      isLastMinute,
      paymentMethod,
      extras,
    } = data;

    const basePrices = {
      economy: 100,
      business: 200,
      firstClass: 300,
    };

    let pricePerTicket = basePrices[ticketType] || 0;

    // Adăugăm costul opțiunilor suplimentare
    if (extras) {
      if (extras.meal) pricePerTicket *= 1.05;
      if (extras.extraLuggage) pricePerTicket *= 1.05;
    }
    let total = pricePerTicket * quantity;

    if (isRoundTrip) {
      total *= 0.95; // 5% reducere
    }
    if (isLastMinute) {
      total *= 0.6; // 40% reducere
    }
    return {
      totalPrice: total,
      currency: 'EUR',
      paymentMethod: paymentMethod === 'card' ? 'Card' : 'Cash',
      roundTripDiscountApplied: !!isRoundTrip,
      lastMinuteDiscountApplied: !!isLastMinute,
    };
  }
  async createTicket(dto: CreateTicketDto) {
    return this.prismaService.ticket.create({
      data: {
        passengerName: dto.passengerName,
        phone: dto.phone,
        outboundFlightId: dto.outboundFlightId,
        seatClass: dto.seatClass,
        basePriceCents: dto.basePriceCents,
        totalPriceCents: dto.totalPriceCents,
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
        discountPercent: dto.discountPercent,
        currency: dto.currency,
        returnFlightId: dto.returnFlightId,
        paymentId: dto.paymentId,
      },
    });
  }
}
