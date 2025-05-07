import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dtos/createEventDto';
import { TicketsRepository } from './repository/tickets.repository';
import { EventEntity } from './entities/event.entity';

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

  async createTicket(event: CreateEventDto, authorId: string) {
    const newEventEntity = new EventEntity({
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
