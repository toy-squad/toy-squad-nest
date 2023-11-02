import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailForResetPwdRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  inputEmail: string; // 입력 이메일
}
