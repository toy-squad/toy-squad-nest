import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CoreEntity } from '../../commons/entities/core.entity';
import { SKILL_TYPE } from '../../users/types/skill.type';
import { User } from 'src/users/entities/user.entity';

@Entity({ schema: process.env.DB_NAME })
export class Project extends CoreEntity {

    @Column({
        name: 'name',
        unique: true,
        comment: '프로젝트이름',
    })
    name: string;

    @Column({
        name: 'intro',
        nullable: false,
        comment: '프로젝트 소개',
    })
    intro: string;

    @Column({
        name: 'skills',
        nullable: false,
        comment: '프로젝트 주요 기술',
    })
    skills: string;

    @Column({
        name: 'img_url',
        nullable: true,
        default: null,
        comment: '프로젝트이미지',
    })
    imgUrl: string;


    @Column({
        name: 'recruitment',
        nullable: false,
        default: '1',
        comment: '모집인원',
    })
    recruitment: string;

    @Column({
        name: 'participants',
        nullable: false,
        comment: '참여인원',
    })
    participants: string;

    @Column({
        name: 'completion_status',
        nullable: false,
        comment: '프로젝트 완료 여부',
        default: false,
    })
    completionStatus: boolean;

    @Column({
        name: 'period',
        nullable: false,
        comment: '프로젝트 기간',
    })
    period: string;

    @Column({
        name: 'field',
        nullable: false,
        comment: '프로젝트 분야',
    })
    field: string;

    @Column({
        name: 'type',
        nullable: false,
        comment: '프로젝트 형태',
    })
    type: string;

    @Column({
        name: 'post',
        nullable: false,
        comment: '게시글',
    })
    post: string;

    @ManyToOne(() => User, (user) => user.project ,{ onDelete: 'CASCADE' })
    @JoinColumn({ name: 'leader_id' })
    user: User;

    // @OneToMany(() => Comments, (comments) => comments.project)
    // comments: Comments[];

}