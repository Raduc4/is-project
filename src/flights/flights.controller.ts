import {
  Controller,
  Delete,
  Post,
  Body,
  Get,
  Param,
  Put,
  UseGuards,
  Query,
} from "@nestjs/common";
import { FlightsService } from "./flights.service";
import { CreateFlightDto } from "./dtos/addFlight.dto";
import { SearchFlightDto } from "./dtos/searchFlight.dto";
import { JWTAuthGuard } from "src/auth/guards/jwt.guard";

@Controller("flights")
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get("/search")
  async searchFlight(@Query() searchDto: SearchFlightDto) {
    return this.flightsService.searchFlight(searchDto);
  }

  @UseGuards(JWTAuthGuard)
  @Get("/all")
  async getAllFlights() {
    return this.flightsService.getAllFlights();
  }

  @UseGuards(JWTAuthGuard)
  @Post("/add")
  async addFlight(@Body() createFlightBody: CreateFlightDto) {
    return this.flightsService.addFlight(createFlightBody);
  }

  @Delete("/:id")
  async deleteFlight(@Param() { id }: { id: string }) {
    return this.flightsService.deleteFlight(id);
  }
}
