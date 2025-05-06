import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './tickets.service';
import { CreateEventDto } from './dtos/createEventDto';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserId } from 'src/user/decorators/userId.decorator';

@Controller('events')
export class TicketsController {
  constructor(private readonly eventsService: EventsService) {}
  @Get('/search')
  searchEvents(@Query('title') title: string) {
    if (title.length === 0) return [];
    return this.eventsService.searchEvents(title);
  }

  @Get('/:id')
  getEvent(@Param() { id }: { id: string }) {
    return this.eventsService.findEvent(id);
  }

  @Delete('/:id')
  deleteEvent(@Param() id: string) {
    return this.eventsService.deleteEvent(id);
  }

  @Get()
  getEvents() {
    return this.eventsService.getAllEvents();
  }

  @UseGuards(JWTAuthGuard)
  @Post()
  createEvent(@Body() createEventDto: CreateEventDto, @UserId() id: string) {
    return this.eventsService.createEvent(createEventDto, id);
  }

  @UseGuards(JWTAuthGuard)
  @Post('/bookEvent')
  async bookEvent(
    @Body() { eventId, userId }: { eventId: string; userId: string },
  ) {
    return this.eventsService.bookEvent(eventId, userId);
  }

  @UseGuards(JWTAuthGuard)
  @Put('/:id')
  updateEvent(@Param() id: string, @Body() updatePostDto: any[]) {}
}
