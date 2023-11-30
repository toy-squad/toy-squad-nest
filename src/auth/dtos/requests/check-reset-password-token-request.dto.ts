import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

// ResetPasswordGuard
export class CheckResetPasswordTokenRequestDto {
  userId: string;
  resetPasswordToken: string;
}

export class CheckResetPasswordTokenAndRedirectResetUiRequestDto {
  @ApiProperty({
    required: true,
    description: '비밀번호 변경 요청 이메일',
    example: 'test1@yopmail.com',
  })
  email: string;

  @ApiProperty({
    required: true,
    example: '1701356313469',
    description: '비밀번호 재설정 토큰',
  })
  token: string;
}
