import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { getAtJWTConfig, getRtJWTConfig } from 'src/configs/jwt.config';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { UserRepository } from 'src/user/repository/user.repository';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RtStrategy } from './strategies/refreshtToken.strategy';
import { ImagesService } from 'src/s3/s3.service';

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    JwtModule.registerAsync(getAtJWTConfig()),
    JwtModule.registerAsync(getRtJWTConfig()),
  ],
  providers: [
    AuthService,
    UserService,
    ImagesService,
    UserRepository,
    JwtStrategy,
    RtStrategy,
  ],
})
export class AuthModule {}
