import { Controller, Get, Post, Query } from '@nestjs/common';
import { CodeService } from './code.service';

@Controller('code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}
  @Get()
  async getCode(@Query('phone') phone: string) {
    console.log(phone);
    const phoneNumber = phone[0] === '+' ? phone.slice(1) : phone;
    return this.codeService.getCode(phoneNumber);
  }

  @Post()
  async checkCode(@Query('phone') phone: string, @Query('code') code: string) {
    console.log(phone);
    return this.codeService.checkCode(phone, code);
  }
}
