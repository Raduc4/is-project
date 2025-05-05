import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CodeService {
  private readonly SERVICE_PLAN_ID = '3cfa6c81d9b841b5a9f139f574b08b29';
  private readonly API_TOKEN = 'c2799b8d6e374960ae5037dcf93da115';
  private readonly SINCH_NUMBER = '447537404817';

  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}
  async getCode(phone: string) {
    console.log('service ', phone);
    const user = await this.userService.findOneByPhone(phone.trim());
    console.log('Phone', phone);
    console.log('User', user);
    console.log(user);

    const { isCodeUsed, confirmationCode, enabled } = user;
    console.log(confirmationCode);
    // if (!enabled) {
    //   throw new BadRequestException('User is not enabled');
    // }

    if (isCodeUsed) {
      const { confirmationCode: newConfirmationCode } = await this.refreshCode(
        phone,
      );
      this.run(phone, newConfirmationCode);
    }
    this.run(phone, confirmationCode);
    return { sent: true };
  }

  async checkCode(phone: string, code: string) {
    console.log('Phone', phone);
    console.log('code', code);
    const user = await this.userService.findOneByPhone(phone);
    console.log('USer', user);
    const isCodeUsed = user.isCodeUsed;
    const confirmationCode = user.confirmationCode;
    console.log('Compare two codes', confirmationCode, code);
    console.log('Compare', isCodeUsed);
    if (isCodeUsed) {
      return false;
    }
    if (confirmationCode === Number(code)) {
      await this.prismaService.user.update({
        where: { phone },
        data: {
          isCodeUsed: true,
          enabled: true,
        },
      });
      return true;
    }
  }

  private async refreshCode(phone: string) {
    return this.prismaService.user.update({
      where: { phone },
      data: {
        isCodeUsed: false,
        confirmationCode: Math.floor(Math.random() * 10000),
      },
    });
  }

  async run(number: string, code: number) {
    const resp = await fetch(
      'https://us.sms.api.sinch.com/xms/v1/' +
        this.SERVICE_PLAN_ID +
        '/batches',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.API_TOKEN,
        },
        body: JSON.stringify({
          from: this.SINCH_NUMBER,
          to: [number],
          body: `Meent confirmation code: ${code}`,
        }),
      },
    );

    const data = await resp.json();
    console.log(data);
  }
}
