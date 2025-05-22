import {
  Controller,
  Delete,
  Post,
  Body,
  Query,
  Get,
  Param,
} from '@nestjs/common';
import { FlightsService } from './flights.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFlightDto } from './dtos/addFlight.dto';

@Controller('flights')
export class FlightsController {
  constructor(
    private readonly flightsService: FlightsService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get('/search')
  async searchFlight(@Query('title') title: string) {
    return 'This flight';
    // return this.flightsService.searchFlight(title);
  }

  @Post('/add')
  async addFlight(@Body() createFlightBody: CreateFlightDto) {
    return this.flightsService.addFlight(createFlightBody);
  }

  @Delete(':id')
  async deleteFlight(@Param() id: string) {
    return this.flightsService.deleteFlight(id);
  }
}
