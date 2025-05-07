import { UserRole } from '@prisma/client';

export class RegisterDto {
  email: string;
  password: string;
  phone: string;
  base64: string;
  userType: UserRole;
}

export class LoginDto {
  email: string;
  role: 'USER' | 'ADMIN';
  password: string;
}
