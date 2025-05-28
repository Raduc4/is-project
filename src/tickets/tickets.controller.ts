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
} from "@nestjs/common";
import { TicketsService } from "./tickets.service";
import { CreateTicketDto } from "./dtos/createTicketDto";
import { JWTAuthGuard } from "src/auth/guards/jwt.guard";
import { UserId } from "src/user/decorators/userId.decorator";
import { Public } from "../auth/guards/publicMetadata";

@Controller("tickets")
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Public()
  @Get("/price")
  async calculatePrice(@Query() query: any) {
    return this.ticketsService.calculatePrice({
      ticketType: query.ticketType,
      quantity: Number(query.quantity),
      isRoundTrip: query.isRoundTrip === 'true',
      isLastMinute: query.isLastMinute === 'true',
      paymentMethod: query.paymentMethod,
      extras: {
        meal: query.meal === 'true',
        extraLuggage: query.extraLuggage === 'true',
      },
    });
  }

  @UseGuards(JWTAuthGuard)
  @Get("/:id")  // The parameter route now comes AFTER the specific route
  getTicket(@Param() { id }: { id: string }) {
    return this.ticketsService.findTicket(id);
  }

  @UseGuards(JWTAuthGuard)
  @Delete("/:id")
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
  @Put("/:id")
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateTicket(@Param() id: string, @Body() updatePostDto: any[]) {}
}
