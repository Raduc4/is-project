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
import { CreateTicketDto } from './dtos/createTicketDto';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserId } from 'src/user/decorators/userId.decorator';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(JWTAuthGuard)
  @Get('/:id')
  getTicket(@Param() { id }: { id: string }) {
    return this.ticketsService.findTicket(id);
  }

  @UseGuards(JWTAuthGuard)
  @Delete('/:id')
  deleteTicket(@Param() id: string) {
    return this.ticketsService.deleteTicket(id);
  }

  @UseGuards(JWTAuthGuard)
  @Get()
  getTickets() {
    return this.ticketsService.getAllTickets();
  }

  @Post()
  createTicket(@Body() createEventDto: CreateTicketDto, @UserId() id: string) {
    return this.ticketsService.createTicket(createEventDto);
  }

  @UseGuards(JWTAuthGuard)
  @Put('/:id')
  updateTicket(@Param() id: string, @Body() updatePostDto: any[]) {}
}
