import { ITicket} from '../interfaces/event.interface';

export class TicketEntity implements ITicket {
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

  constructor(user: ITicket) {
    const {
      _id,
      title,
      price,
      location,
      images,
      description,
      days,
      hourFrom,
      hourTo,
      howToSell,
      slotsSplit,
      offerType,

      authorId,
    } = user;
    this._id = _id;
    (this.title = title), (this.price = price), (this.location = location);
    this.images = images;
    this.description = description;
    this.authorId = authorId;
    this.hourFrom = hourFrom;
    this.hourTo = hourTo;
    this.days = days;
    this.howToSell = howToSell;
    this.slotsSplit = slotsSplit;
    this.offerType = offerType;
  }
}
