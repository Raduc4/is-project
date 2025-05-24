import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TicketEntity } from '../entities/ticket.entity';
import { randomUUID } from 'crypto';
@Injectable()
export class TicketsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createTicket(event: TicketEntity) {
    const newTicket = await this.prismaService.ticket.create({
      data: {
        title: event.title,
        price: event.price,
        location: event.location,
        description: event.description,
        savedByUsers: { create: [] },
        authorId: event.authorId,
        days: event.days,
        dateTo: event.hourTo,
        dateFrom: event.hourFrom,
      },
    });

    return newTicket;
  }
}
