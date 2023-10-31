import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CoreEntity } from '../../commons/entities/core.entity';
import { Role } from '../../role/entities/role.entity';
import { contactType } from 'projects/enums/contactType.enum';
import { User } from 'users/entities/user.entity';

@Entity({ schema: process.env.DB_NAME })
export class Project extends CoreEntity {
  @Column({
    name: 'name',
    nullable: false,
    comment: '프로젝트 이름',
  })
  name: string;

  @Column({
    name: 'intro',
    nullable: true,
    default: null,
    comment: '프로젝트 소개',
  })
  intro: string;

  @Column({
    name: 'description',
    nullable: true,
    default: null,
    comment: '프로젝트 설명',
  })
  description: string;

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
    comment: '프로젝트 썸네일 이미지 URL',
  })
  imgUrl: string;

  /**
   * [추후] 프로젝트전시
   * 프로젝트 완료가 true 이면 => 프로젝트 전시가 가능.
   */
  @Column({
    name: 'completion_status',
    nullable: false,
    comment: '프로젝트 완료 여부',
    default: false,
  })
  completionStatus: boolean;

  /**
   * 프로젝트 기간
   * - 프로젝트 시작일자(YYYY년 MM월 DD일)
   * - 프로젝트 종료일자(YYYY년 MM월 DD일)
   */
  @Column({
    name: 'start_date',
    nullable: true,
    default: null,
    comment: '프로젝트 시작일자',
  })
  start_date: string;

  @Column({
    name: 'end_date',
    nullable: true,
    default: null,
    comment: '프로젝트 종료일자',
  })
  end_date: string;

  /**
   * 프로젝트 완성품 타입
   * - 프로젝트 플랫폼
   * - 모바일, 앱(App), 데스크탑 앱, 프로그램, 웹, 게임
   */
  @Column({
    name: 'product_type',
    nullable: true,
    default: null,
    comment: '프로젝트 완성품 타입',
  })
  productType: string;

  /**
   * 프로젝트 분야
   * - 유저가 생성하는 컨텐츠
   * - 동적데이터
   * - 예: 건강/운동, 게임, 금융, 어린이 등 ...
   */
  @Column('simple-array', {
    name: 'fields',
    nullable: true,
    default: null,
    comment: '프로젝트 분야',
  })
  fields: string[];

  /**
   * 프로젝트 대면/비대면/혼합
   * - C  : 대면(Contact)
   * - U  : 비대면(Untact)
   * - M  : 대면/비대면 혼합방식(Mix)
   */
  @Column({
    name: 'contact_type',
    nullable: false,
    default: contactType.UNTACT,
    comment: '프로젝트 대면/비대면 여부',
  })
  contactType: contactType;

  /**
   * 프로젝트 활동 장소
   * - contact_type: C | M 만 입력가능
   */
  @Column({
    name: 'place',
    nullable: true,
    default: null,
    comment: '프로젝트 활동 장소',
  })
  place: string;

  /** 프로젝트 모집
   * - recruit_start_date    : 모집시작일자
   * - recruit_end_date      : 모집마감일자
   */

  @Column({
    name: 'recruit_start_date',
    nullable: true,
    default: null,
    comment: '모집 시작일',
  })
  recruitStartDate: string;

  @Column({
    name: 'recruit_end_date',
    nullable: true,
    default: null,
    comment: '모집 마감일',
  })
  recruitEndDate: string;

  /**
   * 다른테이블과 연결관계
   * Todo
   * User         : 이용자 = 프로젝트 생성자 (초기 팀장)
   * Project      : 프로젝트
   * MemberRoles   : 프로젝트 멤버역할
   *
   * 1. User(프로젝트 생성자=초기팀장)  : Project       = 1:N
   * 2. Project                   : MemberRoles   = 1:N
   * 3. Project                   : Comment       = 1:N
   *
   */

  /**
   * 프로젝트 : 유저 = N:1
   */
  @ManyToOne(() => User, (user) => user.projects)
  user: User;

  /**
   * 프로젝트 : 권한 = 1:N
   */
  @OneToMany(() => Role, (role) => role.project)
  @JoinColumn({ name: 'role', referencedColumnName: 'id' })
  roles: Role[];
}
