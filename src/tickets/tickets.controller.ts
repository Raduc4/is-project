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
import { Ticket } from "@prisma/client";

@Controller("tickets")
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get("price/calculate")
  calculatePrice(
    @Query("ticketType") ticketType: string,
    @Query("quantity") quantity: string,
    @Query("isRoundTrip") isRoundTrip: string,
    @Query("isLastMinute") isLastMinute: string,
    @Query("paymentMethod") paymentMethod: string,
    @Query("meal") meal: string,
    @Query("extraLuggage") extraLuggage: string
  ) {
    console.log("Raw query params:", {
      ticketType,
      quantity,
      isRoundTrip,
      isLastMinute,
      paymentMethod,
      meal,
      extraLuggage,
    });

    return this.ticketsService.calculatePrice({
      ticketType: ticketType as "economy" | "business" | "firstClass",
      quantity: parseInt(quantity, 10),
      isRoundTrip: isRoundTrip === "true",
      isLastMinute: isLastMinute === "true",
      paymentMethod: paymentMethod as "card" | "cash" | "cache",
      extras: {
        meal: meal === "true",
        extraLuggage: extraLuggage === "true",
      },
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
  getTickets(): Promise<Ticket[]> {
    return this.ticketsService.getAllTickets();
  }

  @Post()
  createTicket(@Body() createEventDto: CreateTicketDto) {
    return this.ticketsService.createTicket(createEventDto);
  }

  @UseGuards(JWTAuthGuard)
  @Put("/:id")
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateTicket(@Param() id: string, @Body() updatePostDto: any[]) {}
}
