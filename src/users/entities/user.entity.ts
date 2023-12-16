import { ApiProperty } from '@nestjs/swagger';
import { CoreEntity } from '../../commons/entities/core.entity';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { Role } from 'role/entities/role.entity';
import { Project } from 'projects/entities/project.entity';
import { Comment } from 'comment/entities/comment.entity';

@Entity({ schema: process.env.DB_NAME })
export class User extends CoreEntity {
  @ApiProperty({ description: '이메일', example: 'test1@yopmail.com' })
  @Column({
    name: 'email',
    unique: true,
    comment: '이메일',
  })
  email: string;

  @ApiProperty({ description: '패스워드', example: '8자 이상 비밀번호' })
  @Column({
    name: 'password',
    nullable: false,
    comment: '패스워드',
  })
  password: string;

  @ApiProperty({ description: '이름', example: '석지웅' })
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

  @ApiProperty({ description: '이미지 프로필 이미지 URL' })
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

  // TODO : 작업성향 type정의와 swagger example 필요...
  @ApiProperty({ description: '작업성향' })
  @Column({
    name: 'tendency',
    type: 'simple-array',
    nullable: true,
    default: null,
    comment: '작업성향',
  })
  tendency: string[];

  @ApiProperty({ description: '포지션', example: '웹 풀스택 개발자' })
  @Column({
    name: 'position',
    comment: '포지션',
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
  // @ApiProperty({ description: '유저:프로젝트 = 1:N' })
  @OneToMany(() => Project, (project) => project.user)
  @JoinColumn({ name: 'user', referencedColumnName: 'id' })
  projects: Project[];

  /**
   * 유저 : 권한 = 1:N
   * - 유저가 여러 프로젝트에 가입될 수 있음.
   * - 유저가 가입한 프로젝트의 권한은 하나이다.
   */
  // @ApiProperty({ description: '유저:권한=1:N' })
  @OneToMany(() => Role, (role) => role.user)
  @JoinColumn({ name: 'user', referencedColumnName: 'id' })
  roles: Role[];

  /**
   * 유저 : 댓글 = 1:N
   */
  @ApiProperty({ description: '유저:댓글=1:N' })
  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];
}
