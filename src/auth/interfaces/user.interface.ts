import { UserRole } from "@prisma/client";

export interface IUser {
  _id?: string;
  email: string;
  passwordHash?: string;
  phone: string;
  role: UserRole;
}
