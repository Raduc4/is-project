import { compare, genSalt, hash } from 'bcryptjs';
import { IUser } from '../../auth/interfaces/user.interface';
import { UserRole } from '@prisma/client';

export class UserEntity implements IUser {
  _id?: string;
  phone: string;
  email: string;
  passwordHash: string;
  rtHash: string;
  role: UserRole;

  constructor(user: IUser) {
    this._id = user._id;
    this.passwordHash = user.passwordHash;
    this.email = user.email;
    this.role = user.role;
    this.phone = user.phone;
  }

  public async setPassword(password: string) {
    const salt = await genSalt(10);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  async updateRtHash(rt: string) {
    const salt = await genSalt(10);
    this.rtHash = await hash(rt, salt);
    return this;
  }

  public validatePassword(password: string) {
    return compare(password, this.passwordHash);
  }
}
