import { UserRole } from '@prisma/client';

export interface IUser {
  _id?: string;
  email: string;
  passwordHash?: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  businessName?: string;
  businessAddress?: string;
  businessEmail?: string;
  businessPhone?: string;
  businessPostCode?: string;
  businessDescription?: string;
  businessCategory?: string;
  businessTags?: string[];
}
