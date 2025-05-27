import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserRepository } from "./repository/user.repository";
import { JwtService } from "@nestjs/jwt";
import { ImagesService } from "src/s3/s3.service";
import { S3Module } from "src/s3/s3.module";

@Module({
  imports: [S3Module],
  providers: [UserService, UserRepository, JwtService, ImagesService],
  controllers: [UserController],
  exports: [UserRepository, UserService],
})
export class UserModule {}
