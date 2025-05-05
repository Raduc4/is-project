export interface IEvent {
  _id?: string;
  title: string;
  price: number;
  location: string;
  images: Array<{
    base64: string;
    type: string;
  }>;
  description: string;
  authorId: string;
  hourFrom: string;
  howToSell: 'IRELEVANT' | 'BY_HOUR_SLOTS';
  hourTo: string;
  days: Array<string>;
  slotsSplit: 'FULLDAY' | 'HOURLY';
  offerType: 'PERMANENT' | 'PROMO';
}
