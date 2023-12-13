import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailForResetPwdRequestDto {
  @ApiProperty({
    required: true,
    description: '비밀번호 변경 대상 이메일',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  inputEmail: string; // 입력 이메일
}
