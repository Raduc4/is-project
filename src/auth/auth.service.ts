import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from '../user/repository/user.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/auth.dto';
import { Tokens } from './interfaces/jwt-payload.interface';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { CodeService } from 'src/code/code.service';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { ImagesService } from 'src/s3/s3.service';

@Injectable()
export class AuthService {
  constructor(
    readonly configService: ConfigService,
    readonly userService: UserService,
    readonly prismaService: PrismaService,
    private readonly codeService: CodeService,
    private readonly userRepository: UserRepository,
    private readonly s3Service: ImagesService,
  ) {}

  async verifyAwsJwt(jwt: string) {
    const verifier = CognitoJwtVerifier.create({
      userPoolId: 'us-east-1_K7R5lf7B0',
      tokenUse: 'access',
      clientId: '14p3a3aevea0b69m887mi7ol2u',
    });

    try {
      const data = await verifier.verify(jwt);
      if (data) console.log(data);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }

  async facebookLogin(jwt: string) {
    const verified = await this.verifyAwsJwt(jwt);

    if (verified) {
      const fbid = verified.client_id;
      const user = await this.prismaService.user.findFirst({
        where: { facebookId: fbid },
      });

      if (user === null) {
        return {
          fbid,
          registered: false,
        };
      } else {
        const tokens = await this.userRepository.getTokens(user.id, user.role);

        return {
          id: user.id,
          email: user.email,
          phone: user.phone ?? undefined,
          tokens,
          userId: user.id,
          enabled: user.enabled,
          avatar: user.avatar,
        };
      }
    }
  }

  async register(user: RegisterDto) {
    const oldUser = await this.userRepository.findUserByEmail(user.email);
    console.log('Old user', user);
    // if (oldUser)
    //   throw new BadRequestException('User registered already', {
    //     cause: new Error(),
    //     description: 'User is registered already with this email',
    //   });
    // const phoneNumber = phone[0] === '+' ? phone.slice(1) : phone;
    // console.log('Phone number', userType);
    // let newUserEntity: UserEntity;
    // if (userType === 'USER') {
    //   newUserEntity = await new UserEntity({
    //     email: email.trim(),
    //     passwordHash: '',
    //     avatar: '',
    //     phone: phoneNumber,
    //     role: userType,
    //   }).setPassword(password);
    // } else {
    //   const {
    //     businessAddress = '',
    //     businessName = '',
    //     businessPhone = '',
    //     businessPostCode = '',
    //   } = businessInfo || {};

    //   newUserEntity = await new UserEntity({
    //     email: email.trim(),
    //     passwordHash: '',
    //     avatar: '',
    //     phone: phoneNumber,
    //     role: userType,
    //     businessAddress,
    //     businessName,
    //     businessPhone,
    //     businessPostCode,
    //     businessDescription,
    //     businessTags: tags,
    //     businessCategory: category,
    //   }).setPassword(password);
    // }

    // const newUser = await this.userRepository.createUser(newUserEntity);
    // const response = await this.prismaService.user.update({
    //   where: { id: newUser.id },
    //   data: undefined,
    // });
    // const tokens = await this.userRepository.getTokens(
    //   newUser.id,
    //   newUser.role,
    // );

    // return {
    //   id: response.id,
    //   email: response.email,
    //   phone: response.phone,
    //   tokens,
    //   avatar: response.avatar,
    //   phoneNumber: response.phone,
    //   userId: response.id,
    //   isEnabled: response.enabled,
    //   businessInfo: {
    //     businessAddress: response.businessAddress,
    //     businessName: response.businessName,
    //     businessPostCode: response.businessPostCode,
    //     businessPhone: response.businessPhone,
    //   },
    //   businessDescription: response.businessDescription,
    //   businessTags: response.businessTags,
    //   businessCategory: response.businessCategory,
    // };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) throw new Error('This user does not exist');

    if (user.facebookOauth && !user.passwordHash)
      throw new BadRequestException('Facebook check', {
        cause: new Error(),
        description: 'User is registered with facebook',
      });

    const userEntity = new UserEntity(user);
    const isCorrectPass = await userEntity.validatePassword(password);
    if (!isCorrectPass) throw new Error('Incorrect email or password');
    if (user.role === 'USER') {
      return {
        id: user.id,
        isEnabled: user.enabled,
        phoneNumber: user.phone,
        avatar: user.avatar,
        email: user.email,
        role: user.role,
      };
    } else {
      console.log('User', user);
      return {
        id: user.id,
        isEnabled: user.enabled,
        phoneNumber: user.phone,
        avatar: user.avatar,
        email: user.email,
        role: user.role,
        businessName: user.businessName,
        businessAddress: user.businessAddress,
        businessPhone: user.businessPhone,
        businessPostCode: user.businessPostCode,
        businessDescription: user.businessDescription,
        businessCategory: user.businessCategory,
        businessTags: user.businessTags,
      };
    }
  }

  async refreshTokens(userId: string): Promise<Tokens> {
    const user = await this.userRepository.findUserById(userId);
    if (!user)
      throw new HttpException('This user does not exist', HttpStatus.FORBIDDEN);

    const tokens = await this.userRepository.getTokens(user.id, user.role);
    // const userEntity = await new UserEntity(user).updateRtHash(
    //   tokens.refresh_token,
    // );
    // this.userRepository.updateRtHash(userEntity);
    return tokens;
  }

  async login(id: string, role: 'USER' | 'ADMIN') {
    console.log('Login id', role);
    return this.userRepository.getTokens(id, role);
  }

  async forgotPassword({ phone }: ForgotPasswordDto) {
    let phoneNumber: string;
    if (phone[0] === '+') {
      phoneNumber = phone.slice(1).trim();
    }
    const user = await this.userRepository.findOneByPhone(phoneNumber);
    if (!user)
      throw new BadRequestException('User not found', {
        cause: new Error(),
        description: 'Some error description',
      });
    await this.codeService.getCode(phoneNumber);
  }

  async forgotSetPassword(phone: string, code: string, password: string) {
    console.log('Forgot phone ', phone);
    console.log(password);

    const user = await this.userRepository.findOneByPhone(phone);
    console.log('Forgot pass user', user);
    if (!user) throw new BadRequestException('User not found');

    console.log('USer hash before', user.passwordHash);
    console.log('Code', password);
    if (user.confirmationCode.toString() === code.toString()) {
      const userEntity = await new UserEntity(user).setPassword(password);
      console.log('USer hash after', userEntity.passwordHash);
      await this.prismaService.user.update({
        where: { id: userEntity._id, phone: userEntity.phone },
        data: { passwordHash: userEntity.passwordHash },
      });
      return true;
    }
    throw new BadRequestException('Code is not valid');
  }

  async resetPassword({ id, oldPassword, newPassword }: ResetPasswordDto) {
    const user = await this.userRepository.findUserById(id);
    if (!user) throw new BadRequestException('User not found');
    const userEntity = new UserEntity(user);
    const isCorrectPass = await userEntity.validatePassword(oldPassword);
    if (!isCorrectPass) throw new Error('Incorrect password');
    const updatedUser = await userEntity.setPassword(newPassword);
    await this.userRepository.updatePassword(updatedUser);
    return true;
  }

  isAdmin(role: string): boolean {
    return role.includes('ADMIN');
  }
}
