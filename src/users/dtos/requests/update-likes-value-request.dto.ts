import { ApiProperty } from '@nestjs/swagger';

export class UpdateLikesValueRequestDto {
  @ApiProperty({
    required: true,
    description: '좋아요 대상 유저 아이디',
    example: 'c2e3a923-7cdb-4716-9caa-839f22639e68',
  })
  target_user_id: string;
}
