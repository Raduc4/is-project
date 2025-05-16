import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TicketEntity } from '../entities/ticket.entity';
import { ImagesService } from 'src/s3/s3.service';
import { randomUUID } from 'crypto';
@Injectable()
export class TicketsRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: ImagesService,
  ) {}

  async createTicket(event: TicketEntity) {
    const imageUploadPromises = event.images.map(async (image) => {
      const imageObject = await this.s3Service.uploadFile(
        image.base64,
        image.type,
        randomUUID(),
      );
      return imageObject.Location;
    });

    const imageUrls = await Promise.all(imageUploadPromises);

    const newEvent = await this.prismaService.ticket.create({
      data: {
        title: event.title,
        price: event.price,
        location: event.location,
        images: imageUrls,
        description: event.description,
        savedByUsers: { create: [] },
        authorId: event.authorId,
        hourFrom: event.hourFrom,
        hourTo: event.hourTo,
        days: event.days,
      },
    });

    return newEvent;
  }
}
