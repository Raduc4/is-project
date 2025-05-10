import { Injectable } from '@nestjs/common';

@Injectable()
export class FlightsService {

    async addFlight() {
        return {
            status: true,
            message: 'Flight added successfully',
        };
    }
}
