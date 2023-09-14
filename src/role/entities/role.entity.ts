import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CoreEntity } from '../../commons/entities/core.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity({ schema: process.env.DB_NAME })
export class Role extends CoreEntity {

/** 
*   권한
*       -설명: 프로젝트 가입된 멤버의 권한
*           M: 팀원
*           A : 관리자
*           G: 프로젝트 생성자 (팀장) 
**/
@Column({
    name: 'role',
    nullable: false,
    comment: '프로젝트 가입된 멤버의 권한',
    default: 'M',
})
role: string;

/**
* 권한 : 프로젝트 = N:1
*/
@ManyToOne(() => Project, (project) => project.roles)
@JoinColumn({ name: 'project_id',  referencedColumnName: 'id' } )
project: Project;

}
