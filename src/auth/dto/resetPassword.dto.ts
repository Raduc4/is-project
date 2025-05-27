import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  @ApiProperty()
  oldPassword: string;
  @IsNotEmpty()
  @ApiProperty()
  newPassword: string;
}
