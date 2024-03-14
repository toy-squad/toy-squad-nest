import { ApiProperty } from '@nestjs/swagger';
import { CoreEntity } from '../../commons/entities/core.entity';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { Role } from 'role/entities/role.entity';
import { Project } from 'projects/entities/project.entity';
import { Comment } from 'comment/entities/comment.entity';
import { Factory } from 'nestjs-seeder';
import * as bcrypt from 'bcrypt';
import getRandomPosition from 'commons/utils/seeding-position.util';

@Entity({ schema: process.env.DB_NAME })
export class User extends CoreEntity {
  @ApiProperty({ description: '이메일', example: 'test1@yopmail.com' })
  @Factory((faker) => faker.internet.email())
  @Column({
    name: 'email',
    unique: true,
    comment: '이메일',
  })
  email: string;

  @ApiProperty({ description: '패스워드', example: '8자 이상 비밀번호' })
  @Factory(() => bcrypt.hashSync('1234', 10)) // 1234
  @Column({
    name: 'password',
    nullable: false,
    comment: '패스워드',
  })
  password: string;

  @ApiProperty({ description: '이름', example: '석지웅' })
  @Factory((faker) => faker.internet.userName)
  @Column({
    name: 'name',
    nullable: false,
    comment: '이름',
  })
  name: string;

  @ApiProperty({ description: '연락처', example: '010-1234-5678' })
  @Column({
    name: 'phone',
    nullable: true,
    default: null,
    comment: '연락처',
  })
  phone: string;

  @Column({
    name: 'kakao_auth_id',
    nullable: true,
    default: null,
    comment: '카카오 연동 로그인 아이디',
  })
  kakaoAuthId: string;

  @Column({
    name: 'google_auth_id',
    nullable: true,
    default: null,
    comment: '구글 연동 로그인 아이디',
  })
  googleAuthId: string;

  @ApiProperty({
    description: '이미지 프로필 이미지 URL',
    example:
      'https://toy-squads-image-buckets.s3.ap-northeast-2.amazonaws.com/users/{your-user-id}/profile/profile-img-{your-user-id}.gif',
  })
  @Column({
    name: 'img_url',
    nullable: true,
    default: null,
    comment: '유저이미지',
  })
  imgUrl: string;

  @ApiProperty({
    description: '선호 분야',
    example: ['어린이', '스포츠', '금융'],
  })
  @Column({
    name: 'fields',
    type: 'simple-array',
    nullable: true,
    default: null,
    comment: '선호하는 분야',
  })
  fields: string[];

  @ApiProperty({
    description: '작업성향',
    example: [
      '계획 수립과 일정 관리를 통해 프로젝트를 체계적으로 추진합니다.',
      '어려운 상황에서도 냉정하게 문제를 해결하고 팀원들에게 효과적인 해결책을 제시합니다.',
    ],
  })
  @Column({
    name: 'tendency',
    type: 'simple-array',
    nullable: true,
    default: null,
    comment: '작업성향',
  })
  tendency: string[];

  @ApiProperty({ description: '포지션', example: '웹 풀스택 개발자' })
  @Factory(() => getRandomPosition())
  @Column({
    name: 'position',
    comment: '포지션',
    nullable: true,
    default: null,
  })
  position: string;

  @ApiProperty({
    description: '자기소개',
    example: '안녕하세요. 성장하고 싶은 풀스택 개발자 석지웅 입니다.',
  })
  @Column({ name: 'intro', nullable: true, default: null, comment: '자기소개' })
  intro: string;

  // 주요스킬이 없다면 null 로 한다.
  @ApiProperty({
    description: '주요 기술',
    example: ['Typescript', 'React JS', 'Node JS', 'Github'],
  })
  @Column({
    type: 'simple-array',
    name: 'skills',
    nullable: true,
    default: null,
    comment: '주요 스킬',
  })
  skills: string[];

  @ApiProperty({ description: '좋아요 수', example: 0 })
  @Column({ name: 'likes', default: 0, comment: '좋아요수' })
  likes: number;

  /**
   * 유저 : 프로젝트 = 1:N
   */
  @OneToMany(() => Project, (project) => project.user)
  @JoinColumn({ name: 'user', referencedColumnName: 'id' })
  projects: Project[];

  /**
   * 유저 : 권한 = 1:N
   * - 유저가 여러 프로젝트에 가입될 수 있음.
   * - 유저가 가입한 프로젝트의 권한은 하나이다.
   */
  @OneToMany(() => Role, (role) => role.user)
  @JoinColumn({ name: 'user', referencedColumnName: 'id' })
  roles: Role[];

  /**
   * 유저 : 댓글 = 1:N
   */
  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];
}
