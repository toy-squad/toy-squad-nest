import { CreateDateColumn, DeleteDateColumn, Entity } from 'typeorm';

@Entity()
export class CoreEntity {
  @CreateDateColumn({
    name: 'created_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    comment: '생성일자',
  })
  createdAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
    comment: '삭제일자',
  })
  deletedAt: Date;
}
