import { ApiProperty } from '@nestjs/swagger';

/**
 * likeType : 좋아요 타입
 * - LIKE   : 좋아요
 * - CANCEL : 좋아요 취소
 */
type likeType = 'LIKE' | 'CANCEL';

export class UpdateLikeUserRequestDto {
  @ApiProperty({
    required: true,
    description: '좋아요(좋아요 취소) 를 받은 유저 아이디',
    example: 'c2e3a923-7cdb-4716-9caa-839f22639e68',
  })
  to: string;

  @ApiProperty({
    required: true,
    description: '좋아요 유형 (LIKE: 좋아요, CANCEL: 좋아요 취소)',
    example: 'LIKE',
  })
  likeType: likeType;
}
export class UpdateLikeUserServiceRequestDto {
  @ApiProperty({
    required: true,
    description: '좋아요(좋아요 취소)를 준 유저아이디 : 로그인 유저',
  })
  from: string;

  @ApiProperty({
    required: true,
    description: '좋아요(좋아요 취소) 를 받은 유저 아이디',
    example: 'c2e3a923-7cdb-4716-9caa-839f22639e68',
  })
  to: string;

  @ApiProperty({
    required: true,
    description: '좋아요 유형 (LIKE: 좋아요, CANCEL: 좋아요 취소)',
    example: 'LIKE',
  })
  likeType: likeType;
}
