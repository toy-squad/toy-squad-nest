import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CoreEntity } from './core.entity';
import { Project } from '../projects/entities/project.entity';
import { User } from './user.entity';

/**
 * 권한 타입
 * - M: 팀원
 * - A: 관리자
 * - G: 프로젝트 생성자
 */
export type RoleType = 'M' | 'A' | 'G';

@Entity({ schema: process.env.DB_NAME, name: 'role' })
export class Role extends CoreEntity {
  @Column({
    name: 'role',
    nullable: false,
    comment: '프로젝트 가입된 멤버의 권한',
    default: 'M',
  })
  role: RoleType;

  /**
   * 권한 : 프로젝트 = N:1
   */
  @ManyToOne(() => Project, (project) => project.roles)
  @JoinColumn({ name: 'project', referencedColumnName: 'id' })
  project: Project;

  /**
   * 권한 : 유저 = N:1
   * - 유저가 여러 프로젝트에 가입될 수 있음.
   * - 유저가 가입한 프로젝트의 권한은 하나이다.
   */
  @ManyToOne(() => User, (user) => user.roles)
  @JoinColumn({ name: 'user', referencedColumnName: 'id' })
  user: User;
}
