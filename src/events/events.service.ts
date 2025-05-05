import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dtos/createEventDto';
import { EventRepository } from './repository/event.repository';
import { EventEntity } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventRepository: EventRepository,
  ) {}

  async findEvent(id: string) {
    return await this.prismaService.event.findUnique({ where: { id } });
  }
  async searchEvents(title: string) {
    return this.prismaService.event.findMany({
      where: { title: { contains: title, mode: 'insensitive' } },
      take: 10,
    });
  }

  async deleteEvent(id: string) {
    return await this.prismaService.event.delete({ where: { id } });
  }

  async getAllEvents() {
    return await this.prismaService.event.findMany({ take: 10 });
  }

  async bookEvent(eventId: string, userId: string) {}

  async createEvent(event: CreateEventDto, authorId: string) {
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
    return await this.eventRepository.createEvent(newEventEntity);
  }
}
