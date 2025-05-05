import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UserId } from 'src/user/decorators/userId.decorator';
import { RtGuard } from './guards/jwtrt.guard';
import { Tokens } from './interfaces/jwt-payload.interface';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Body() user: RegisterDto) {
    return await this.authService.register(user);
  }

  @Post('/verifyJwtAws')
  async verifyAwsJwt(@Query() { jwt }: { jwt: string }) {
    return await this.authService.verifyAwsJwt(jwt);
  }

  @Post('/fbLogin')
  async fbLogin(@Query() { jwt }: { jwt: string }) {
    return await this.authService.facebookLogin(jwt);
  }

  @Post('/fbRegister')
  async fbRegister(
    @Query() { jwt }: { jwt: string },
    @Body()
    user: RegisterDto,
  ) {
    return await this.authService.userFacebookRegister(jwt, user);
  }

  @Post('/login')
  async login(@Body() { email, password, role }: LoginDto) {
    console.log('login');
    const response = await this.authService.validateUser(email, password);
    if (!response) throw new Error('Invalid credentials');
    if (response.role !== role)
      throw new Error(
        'User is registered as a ' + response.role + ' not a ' + role,
      );
    const tokens = await this.authService.login(response.id, response.role);

    return { ...response, tokens };
  }

  @Get('/forgotPassword')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('/forgotPassword')
  async forgotPasswordSet(
    @Query()
    {
      phone,
      code,
      password,
    }: {
      phone: string;
      code: string;
      password: string;
    },
  ) {
    return this.authService.forgotSetPassword(phone, code, password);
  }

  @Post('/resetPassword')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  // @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@UserId() userId: string): Promise<Tokens> {
    return this.authService.refreshTokens(userId);
  }
}
