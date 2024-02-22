import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Likes } from 'likes/entities/likes.entity';

export class LikesHistoriesResponseDto {
  likeHistories: Likes[];
  likes: number;
}

export class FindGaveLikesHistoryResponseDto extends PartialType(
  LikesHistoriesResponseDto,
) {
  @ApiProperty({
    description: '누른 좋아요 이력',
  })
  likeHistories: Likes[];

  @ApiProperty({
    description: '누른 좋아요 수',
  })
  likes: number;
}

export class FindReceivedLikesHistoryResponseDto extends PartialType(
  LikesHistoriesResponseDto,
) {
  @ApiProperty({
    description: '받은 좋아요 이력',
  })
  likeHistories: Likes[];

  @ApiProperty({
    description: '받은 좋아요 수',
  })
  likes: number;
}
