import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindOneLikesHistoryDto {
  @ApiProperty({
    required: true,
    description: '좋아요(좋아요 취소)를 받은 유저의 user_id',
    // example: '',
  })
  @IsNotEmpty()
  @IsString()
  to: string;

  @ApiProperty({
    required: true,
    description: '좋아요(좋아요 취소)를 누른 유저의 user_id',
    // example: '',
  })
  @IsNotEmpty()
  @IsString()
  from: string;
}

export class InsertLikesHistoryDto extends PartialType(
  FindOneLikesHistoryDto,
) {}

export class CancelLikesHistoryDto extends PartialType(
  FindOneLikesHistoryDto,
) {}
