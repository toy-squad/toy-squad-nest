import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CoreEntity } from '../../commons/entities/core.entity';
import { SKILL_TYPE } from '../../users/types/skill.type';
import { Users } from 'users/entities/user.entity';
import { SKILL_TYPE_SET } from 'commons/types/skill.type';

@Entity({ schema: process.env.DB_NAME })
export class Project extends CoreEntity {
  @Column({
    name: 'name',
    unique: true,
    default: '',
    comment: '프로젝트이름',
  })
  name: string;

  @Column({
    name: 'intro',
    nullable: true,
    default: null,
    comment: '프로젝트 소개',
  })
  intro: string;

  /**
   * 프로젝트 주요기술
   */
  @Column('simple-array', {
    name: 'skills',
    nullable: true,
    comment: '프로젝트 주요 기술',
  })
  skills: string[];

  @Column({
    name: 'img_url',
    nullable: true,
    default: null,
    comment: '프로젝트이미지',
  })
  imgUrl: string;

  @Column({
    name: 'recruitments',
    nullable: false,
    default: 0,
    comment: '모집인원',
  })
  recruitments: number;

  @Column({
    name: 'participants',
    nullable: false,
    default: 0,
    comment: '참여인원',
  })
  participants: number;

  @Column({
    name: 'completion_status',
    nullable: false,
    comment: '프로젝트 완료 여부',
    default: false,
  })
  completionStatus: boolean;

  @Column({
    name: 'period',
    nullable: true,
    default: null,
    comment: '프로젝트 기간',
  })
  period: string;

  /**
   * 프로젝트 분야
   * - 유저가 생성하는 컨텐츠
   * - 동적데이터
   */
  @Column('simple-array', {
    name: 'field',
    nullable: true,
    default: null,
    comment: '프로젝트 분야',
  })
  field: string[];

  /**
   * 프로젝트 타입
   * - 프로젝트 플랫폼
   * - 모바일, 앱, 데스크탑 앱, 프로그램, 웹, 게임
   */
  @Column({
    name: 'type',
    nullable: true,
    default: null,
    comment: '프로젝트 타입',
  })
  type: string;

  /**
   * 프로젝트 대면/비대면 여부
   * - 대면: true
   * - 비대면: false
   */
  @Column({
    name: 'contact',
    nullable: false,
    default: true,
    comment: '프로젝트 대면/비대면 여부',
  })
  contact: boolean;

  /**
   * 프로젝트 총 기간
   */
  @Column({
    name: 'duration',
    nullable: true,
    default: 0,
    comment: '프로젝트 기간',
  })
  duration: number;

  /**
   * 모집마감일
   */
  @Column({
    name: 'recruit_end_date',
    nullable: true,
    default: null,
    comment: '모집마감일',
  })
  recruitEndDate: string;

  /**
   * 프로젝트 팀장(유저) : 프로젝트 = 1:N
   */
  // @ManyToOne(() => Users, (user) => user.project)
  // @JoinColumn({ name: 'leader_id', referencedColumnName: 'id' })
  // user: Users;

  // @OneToMany(() => Comments, (comments) => comments.project)
  // comments: Comments[];
}
