import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Likes } from 'entities/likes.entity';

export class LikesHistoriesResponseDto {
  likeHistories: Likes[];
  likes: number;
}

export class FindGaveLikesHistoryResponseDto extends PartialType(
  LikesHistoriesResponseDto,
) {
  @ApiProperty({
    description: '누른 좋아요 이력',
    example: [
      {
        from: '{your-user-id}',
        to: '{other-user-id-1}',
      },
      {
        from: '{your-user-id}',
        to: '{other-user-id-2}',
      },
    ],
  })
  likeHistories: Likes[];

  @ApiProperty({
    description: '누른 좋아요 수',
    example: 0,
  })
  likes: number;
}

export class FindReceivedLikesHistoryResponseDto extends PartialType(
  LikesHistoriesResponseDto,
) {
  @ApiProperty({
    description: '받은 좋아요 이력',
    example: [
      {
        from: '{other-user-id-1}',
        to: '{your-user-id}',
      },
      {
        from: '{other-user-id-2}',
        to: '{your-user-id}',
      },
    ],
  })
  likeHistories: Likes[];

  @ApiProperty({
    description: '받은 좋아요 수',
    example: 0,
  })
  likes: number;
}

export interface IMyPageLikesInfoResponse {
  gave: FindGaveLikesHistoryResponseDto;
  received: FindReceivedLikesHistoryResponseDto;
}

export class MyPageLikesInfoResponseDto implements IMyPageLikesInfoResponse {
  @ApiProperty({
    description: '(로그인 유저가) 준 좋아요 정보',
  })
  gave: FindGaveLikesHistoryResponseDto;

  @ApiProperty({
    description: '(로그인 유저가) 받은 좋아요 정보',
  })
  received: FindReceivedLikesHistoryResponseDto;
}
