import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TicketsRepository } from './repository/tickets.repository';
import { ImagesService } from 'src/s3/s3.service';

@Module({
  providers: [TicketsService, TicketsRepository, ImagesService],
  controllers: [TicketsController],
})
export class PostsModule {}
