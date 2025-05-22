import { ITicket} from '../interfaces/event.interface';

export class TicketEntity implements ITicket {
  _id?: string;
  title: string;
  price: number;
  location: string;
  description: string;
  authorId: string;
  hourFrom: string;
  hourTo: string;
  days: Array<string>;

  constructor(user: ITicket) {
    const {
      _id,
      title,
      price,
      location,
      description,
      days,
      hourFrom,
      hourTo,

      authorId,
    } = user;
    this._id = _id;
    (this.title = title), (this.price = price), (this.location = location);
    this.description = description;
    this.authorId = authorId;
    this.hourFrom = hourFrom;
    this.hourTo = hourTo;
    this.days = days;
  }
}
