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
    default: '카카오 연동 로그인 아이디',
  })
  kakaoId: string;

  @Column({
    name: 'google_auth_id',
    nullable: true,
    default: '구글 연동 로그인 아이디',
  })
  googleId: string;

  /**
   * [Todo]
   *    요구사항 확인하여 유저 엔티티에 필요한 컬럼확인 및 보충
   * */
}
