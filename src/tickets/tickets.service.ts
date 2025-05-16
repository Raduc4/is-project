import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto } from './dtos/createTicketDto';
import { TicketsRepository } from './repository/tickets.repository';
import { TicketEntity } from './entities/ticket.entity';

@Injectable()
export class TicketsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly ticketRepository: TicketsRepository,
  ) {}

  async findTicket(id: string) {
    return await this.prismaService.ticket.findUnique({ where: { id } });
  }
  async searchTicket(title: string) {
    return this.prismaService.ticket.findMany({
      where: { title: { contains: title, mode: 'insensitive' } },
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
  async createTicket(event: CreateTicketDto, authorId: string) {
    // const price = await this.calculatePrice();
    const newEventEntity = new TicketEntity({
      title: 'Test',
      price: 10,
      location: 'Location',
      images: event.images,
      description: event.description,
      authorId: authorId,
      days: event.days,
      hourFrom: event.hourFrom,
      hourTo: event.hourTo,
      howToSell: event.howToSell,
      offerType: event.offerType,
      slotsSplit: event.slotsSplit,
    });
    return await this.ticketRepository.createTicket(newEventEntity);
  }
}
