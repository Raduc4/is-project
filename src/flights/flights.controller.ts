import {
  Controller,
  Delete,
  Post,
  Body,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { FlightsService } from './flights.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFlightDto } from './dtos/addFlight.dto';
import { SearchFlightDto } from './dtos/searchFlight.dto';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get('/search')
  async searchFlight(@Body() searchDto: SearchFlightDto) {
    return this.flightsService.searchFlight(searchDto);
  }

  @Post('/add')
  async addFlight(@Body() createFlightBody: CreateFlightDto) {
    return this.flightsService.addFlight(createFlightBody);
  }

  @Delete(':id')
  async deleteFlight(@Param() id: string) {
    return this.flightsService.deleteFlight(id);
  }

  @Put(':id')
  async validateCashPayment(@Param() id: string) {
    return this.flightsService.validateCashPayment(id);
  }
}
