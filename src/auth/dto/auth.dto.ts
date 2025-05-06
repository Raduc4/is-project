import { UserRole } from '@prisma/client';

export class RegisterDto {
  email: string;
  password: string;
  username?: string;
  phone: string;
  base64: string;
  userType: UserRole;
  tags: string[];
  category: string;
  businessDescription?: string;
  businessInfo?: {
    businessName?: string;
    businessAddress?: string;
    businessPostCode?: string;
    businessPhone?: string;
  };
}

export class LoginDto {
  email: string;
  role: 'USER' | 'ADMIN';
  password: string;
}
