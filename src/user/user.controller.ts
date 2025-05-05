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
  @Get('/search')
  async findUsersByUsername(
    @UserId() id: string,
    @Query() { username }: { username: string },
  ) {
    if (username.length === 0) return [];
    return this.userService.findUsersByUsername(username, id);
  }
  @Get('/check')
  async isUsernameAvailble(@Query() { username }: { username: string }) {
    if (username.length === 0) return [];
    return this.userService.checkUsername(username);
  }
  @Get('/checkEmail')
  async isEmailAvailble(@Query() { email }: { email: string }) {
    if (email.length === 0) return [];
    console.log('Email', email);
    return this.userService.checkEmail(email);
  }

  @Get('/verifyFacebookEmail')
  async verifyFbEmail(@Query() email) {
    return this.userService.findFacebookUser(email);
  }
  @UseGuards(JWTAuthGuard)
  @Get('/profile')
  async get_my_profile(@UserId() id) {
    return this.userService.findUser(id);
  }

  @Get()
  async get_all_profiles() {
    return this.userService.findMany();
  }

  @Post('/saveEvent')
  async addSavedEvent(
    @Body() { userId, eventId }: { userId: string; eventId: string },
  ) {
    console.log(userId, eventId);
    return this.userService.addSavedEvent(userId, eventId);
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

  @UseGuards(JWTAuthGuard)
  @Get('/friends')
  async getFriends(@UserId() id: string) {
    return this.userService.getFriends(id);
  }
  @UseGuards(JWTAuthGuard)
  @Get('/friends/pendingRequests')
  async getPendingFriendship(@UserId() id: string) {
    return this.userService.getMyPendingFriendshipRequests(id);
  }

  @UseGuards(JWTAuthGuard)
  @Get('/friends/pendingSentRequests')
  async getPendingSentFriendship(@UserId() id: string) {
    return this.userService.getMyRequestedPendingFriendships(id);
  }

  @UseGuards(JWTAuthGuard)
  @Post('/friends/follow')
  async createFriendshipRequest(
    @UserId() id: string,
    @Query() { friendId }: { friendId: string },
  ) {
    return this.userService.toggleCreateFriendshipRequest(id, friendId);
  }

  @UseGuards(JWTAuthGuard)
  @Post('/friends/accept')
  async acceptFriendshipRequest(
    @UserId() id: string,
    @Query() { friendId }: { friendId: string },
  ) {
    return this.userService.acceptFriendship(id, friendId);
  }

  @UseGuards(JWTAuthGuard)
  @Post('/friends/deny')
  async denyFriendshipRequest(
    @UserId() id: string,
    @Query() { friendId }: { friendId: string },
  ) {
    return this.userService.denyFriendship(id, friendId);
  }

  @UseGuards(JWTAuthGuard)
  @Post('/friends/unfriend')
  async unfriend(
    @UserId() id: string,
    @Query() { friendId }: { friendId: string },
  ) {
    return this.userService.unfriend(id, friendId);
  }
}
