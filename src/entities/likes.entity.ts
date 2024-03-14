import { ApiProperty } from '@nestjs/swagger';
import { CoreEntity } from 'entities/core.entity';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: process.env.DB_NAME, name: 'likes' })
export class Likes extends CoreEntity {
  @ApiProperty({
    description: '좋아요를 준 유저 아이디',
    example: '71df7ab7-6f45-4820-80d2-80117543dbaa',
  })
  @PrimaryColumn({
    name: 'from',
    comment: '좋아요를 준 유저의 PK',
  })
  from: string;

  @ApiProperty({
    description: '좋아요를 받은 유저 아이디',
    example: '793f7ab7-6f45-4820-80d3-80117543dbaf',
  })
  @PrimaryColumn({
    name: 'to',
    comment: '좋아요를 받은 유저의 PK',
  })
  to: string;
}
