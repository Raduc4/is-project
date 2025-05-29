import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserRepository } from "./repository/user.repository";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [],
  providers: [UserService, UserRepository, JwtService],
  controllers: [UserController],
  exports: [UserRepository, UserService],
})
export class UserModule {}
