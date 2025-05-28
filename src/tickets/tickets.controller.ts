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

@Controller("tickets")
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get("/price")
  async calculatePrice(
    @Query("ticketType") ticketType: "economy" | "business" | "firstClass",
    @Query("quantity") quantity: number,
    @Query("isRoundTrip") isRoundTrip: boolean,
    @Query("paymentMethod") paymentMethod: "card" | "cash" | "cache",
    @Query("extras")
    extras: {
      meal?: boolean;
      extraLuggage?: boolean;
    } = {}
  ) {
    return this.ticketsService.calculatePrice({
      ticketType,
      quantity,
      paymentMethod,
      isRoundTrip,
      extras,
    });
  }

  @UseGuards(JWTAuthGuard)
  @Get("/:id")
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
