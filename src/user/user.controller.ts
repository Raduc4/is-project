import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserId } from './decorators/userId.decorator';
import { RolesGuard } from 'src/auth/guards/businessUser.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JWTAuthGuard)
  @Get('/profile')
  async get_my_profile(@UserId() id) {
    return this.userService.findUser(id);
  }

  @Get()
  async get_all_profiles() {
    return this.userService.findMany();
  }
} 
