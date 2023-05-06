import { CoreEntity } from '../../commons/entities/core.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: process.env.DB_NAME })
export class User extends CoreEntity {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({
    name: 'email',
    unique: true,
    comment: '이메일',
  })
  email: string;

  @Column({
    name: 'password',
    nullable: false,
    comment: '패스워드',
  })
  password: string;

  @Column({
    name: 'name',
    nullable: false,
    comment: '이름',
  })
  name: string;

  @Column({
    name: 'phone',
    comment: '연락처',
  })
  phone: string;

  @Column({
    name: 'kakao_auth_id',
    nullable: true,
    default: null,
    comment: '카카오 연동 로그인 아이디',
  })
  kakaoId: string;

  @Column({
    name: 'google_auth_id',
    nullable: true,
    default: null,
    comment: '구글 연동 로그인 아이디',
  })
  googleId: string;

  /**
   * [Todo]
   * */
  @Column({ name: 'img_url', nullable: true, default: null })
  img_url: string;

  @Column({
    name: 'field',
    comment: '관심분야',
  })
  field: string;

  @Column({
    name: 'tendency',
    comment: '성향',
  })
  tendency: string;

  @Column({ nullable: true })
  intro: string;

  @Column({ nullable: true })
  skills: string;

  @Column({ type: 'int' })
  like: number;

  @Column()
  position: string;
}
