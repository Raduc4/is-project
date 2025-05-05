import { Module } from '@nestjs/common';
import { CodeController } from './code.controller';
import { CodeService } from './code.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Module } from 'src/s3/s3.module';
import { ImagesService } from 'src/s3/s3.service';

@Module({
  imports: [UserModule, PrismaModule, S3Module],
  controllers: [CodeController],
  providers: [CodeService, UserService, PrismaService, ImagesService],
  exports: [CodeService],
})
export class CodeModule {}
