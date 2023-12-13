import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshAccessTokenRequestDto {
  @ApiProperty({
    required: true,
    description: '액세스토큰 갱신 대상 유저 PK',
  })
  @IsNotEmpty({ message: 'user_id이 존재하지 않습니다.' })
  user_id: string;

  @ApiProperty({
    required: true,
    description:
      '리프래시 토큰 - refresh-${user_id} 형식의 키값을 가지며, 실제 리프래시토큰은 이 키에 대한 value값에 해당한다.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ0.eyJ1c2VySWQiOiJjMmUzYTkyMy03Y2RiLTQ3MTYtOWNhYS04MzlmMjI2MzllNjgiLCJlbWFpbCI6InRlc3QzQHlvcG1haWwuY29tIiwiaWF0IjoxNzAxNDYzMzcwLCJleHAiOjE3MDE1NDk3NzB9.Se9TpkWdHPaOHPM1rWgkgoWEYY0MtaVMyQCCspnJvJY',
  })
  @IsNotEmpty({ message: 'refresh_token이 존재하지 않습니다.' })
  refresh_token: string;
}
