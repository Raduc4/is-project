import { Module } from '@nestjs/common';
import { EventsService } from './tickets.service';
import { TicketsController} from './tickets.controller';
import { EventRepository } from './repository/event.repository';
import { ImagesService } from 'src/s3/s3.service';

@Module({
  providers: [EventsService, EventRepository, ImagesService],
  controllers: [TicketsController],
})
export class PostsModule {}
