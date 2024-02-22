import { CoreEntity } from 'commons/entities/core.entity';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: process.env.DB_NAME })
export class Likes extends CoreEntity {
  @PrimaryColumn({
    name: 'from',
    comment: '좋아요를 준 유저의 PK',
  })
  from: string;

  @PrimaryColumn({
    name: 'to',
    comment: '좋아요를 받은 유저의 PK',
  })
  to: string;
}
