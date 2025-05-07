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
import { TicketsService } from './tickets.service';
import { CreateEventDto } from './dtos/createEventDto';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserId } from 'src/user/decorators/userId.decorator';

@Controller('events')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}
  @Get('/search')
  searchTickets(@Query('title') title: string) {
    if (title.length === 0) return [];
    return this.ticketsService.searchTicket(title);
  }

  @Get('/:id')
  getTicket(@Param() { id }: { id: string }) {
    return this.ticketsService.findTicket(id);
  }

  @Delete('/:id')
  deleteTicket(@Param() id: string) {
    return this.ticketsService.deleteTicket(id);
  }

  @Get()
  getTickets() {
    return this.ticketsService.getAllTickets();
  }

  @UseGuards(JWTAuthGuard)
  @Post()
  createTicket(@Body() createEventDto: CreateEventDto, @UserId() id: string) {
    return this.ticketsService.createTicket(createEventDto, id);
  }

  @UseGuards(JWTAuthGuard)
  @Post('/bookEvent')
  async bookTicket(
    @Body() { eventId, userId }: { eventId: string; userId: string },
  ) {
    return this.ticketsService.bookTicket(eventId, userId);
  }

  @UseGuards(JWTAuthGuard)
  @Put('/:id')
  updateEvent(@Param() id: string, @Body() updatePostDto: any[]) {}
}
