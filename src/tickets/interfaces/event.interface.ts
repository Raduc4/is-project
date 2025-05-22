export interface ITicket {
  _id?: string;
  title: string;
  price: number;
  location: string;
  description: string;
  authorId: string;
  hourFrom: string;
  hourTo: string;
  days: Array<string>;
}
