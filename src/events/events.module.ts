import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { PostsController } from './events.controller';
import { EventRepository } from './repository/event.repository';
import { ImagesService } from 'src/s3/s3.service';

@Module({
  providers: [EventsService, EventRepository, ImagesService],
  controllers: [PostsController],
})
export class PostsModule {}
