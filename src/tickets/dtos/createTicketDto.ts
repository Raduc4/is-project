import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;
  offerType: 'PERMANENT' | 'PROMO';
  description: string;
  hourFrom: string;
  location: string;
  price: number;
  hourTo: string;
  days: Array<string>;
  howToSell: 'IRELEVANT' | 'BY_HOUR_SLOTS';
  slotsSplit: 'FULLDAY' | 'HOURLY';
  authorId: string;
  images?: Array<{
    base64: string;
    type: string;
  }>;
}
