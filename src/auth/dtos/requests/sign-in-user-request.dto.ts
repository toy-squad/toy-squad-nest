import { ApiProperty } from '@nestjs/swagger';
import { ValidateUserRequestDto } from './validate-user-request.dto';

export class SignInRequestBody {
  @ApiProperty({
    required: true,
    description: '로그인 이메일',
    example: 'test1@yopmail.com',
  })
  email: string;

  @ApiProperty({
    required: true,
    description: '로그인 이메일 계정의 비밀번호',
    example: '계정 비밀번호',
  })
  password: string;
}

export class SignInRequestDto extends ValidateUserRequestDto {
  constructor(email: string, password: string) {
    super(email, password);
  }
}
