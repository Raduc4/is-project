import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { JwtService } from '@nestjs/jwt';
import { PostsModule } from './tickets/tickets.module';
import { S3Module } from './s3/s3.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.account.env' }),
    AuthModule,
    UserModule,
    PrismaModule,
    PostsModule,
    S3Module,
    PaymentsModule,
  ],
  controllers: [],
  providers: [JwtService],
})
export class AppModule {}

