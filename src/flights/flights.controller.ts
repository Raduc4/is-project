import { Controller, Delete, Post,Body } from '@nestjs/common';
import { FlightsService } from './flights.service';
import {PrismaService} from '../prisma/prisma.service';
import { CreateFlightDto } from './dtos/addFlight.dto';

@Controller('flights')
export class FlightsController {
    constructor(
        private readonly flightsService: FlightsService,
         private readonly prismaService: PrismaService,
    ) {}

    @Post('/add')
    async addFlight(@Body() flightData: CreateFlightDto) {
        return this.flightsService.addFlight();
    }


    @Delete(':id')
    async deleteFlight() {
        
    }
}
