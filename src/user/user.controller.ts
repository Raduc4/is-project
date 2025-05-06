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

  @Get('/mySavedEvents')
  getSavedEvents(@Query('id') id: string) {
    console.log(id);
    return this.userService.getSavedEvents(id);
  }

  @UseGuards(JWTAuthGuard)
  @Patch('/updateProfilePicture')
  async updateProfilePicture(
    @UserId() id,
    @Body()
    { base64, type }: { userId: string; base64: string; type: string },
  ) {
    return this.userService.updateProfilePicture(id, base64, type);
  }

  @UseGuards(JWTAuthGuard, RolesGuard)
  @Patch('/updateBusinessName')
  async updateBusinessName(
    @UserId() id,
    @Body() { name }: { userId: string; name: string },
  ) {
    return this.userService.updateBusinessName(id, name);
  }

  @UseGuards(JWTAuthGuard)
  // @UseGuards(RolesGuard)
  @Patch('/updateBusinessAddress')
  async updateBusinessAddress(
    @UserId() id,
    @Body() { businessAddress }: { userId: string; businessAddress: string },
  ) {
    return this.userService.updateBusinessAddress(id, businessAddress);
  }
  @UseGuards(JWTAuthGuard)
  // @UseGuards(RolesGuard)
  @Patch('/updateBusinessEmail')
  async updateBusinessEmail(
    @UserId() id,
    @Body() { businessEmail }: { userId: string; businessEmail: string },
  ) {
    return this.userService.updateBusinessEmail(id, businessEmail);
  }

  @UseGuards(JWTAuthGuard)
  // @UseGuards(RolesGuard)
  @Patch('/updateBusinessPostCode')
  async updateBusinessPostCode(
    @UserId() id,
    @Body() { businessPostCode }: { userId: string; businessPostCode: string },
  ) {
    return this.userService.updateBusinessPostCode(id, businessPostCode);
  }

  @UseGuards(JWTAuthGuard)
  // @UseGuards(RolesGuard)
  @Patch('/updateBusinessDescription')
  async updateBusinessDescription(
    @UserId() id,
    @Body()
    { description }: { userId: string; description: string },
  ) {
    return this.userService.updateBusinessDescription(id, description);
  }

  @UseGuards(JWTAuthGuard)
  // @UseGuards(RolesGuard)
  @Patch('/updateBusinessPhone')
  async updateBusinessPhone(
    @UserId() id,
    @Body() { businessPhone }: { userId: string; businessPhone: string },
  ) {
    return this.userService.updateBusinessPhone(id, businessPhone);
  }

  @UseGuards(JWTAuthGuard)
  // @UseGuards(RolesGuard)
  @Patch('/updateBusinessInfo')
  async bulkBusinessInfoUpdate(
    @UserId() id: string,
    @Body() { businessInfo }: { userId: string; businessInfo: BusinessInfoDto },
  ) {
    return this.userService.bulkBusinessInformationUpdate(id, businessInfo);
  }
}
