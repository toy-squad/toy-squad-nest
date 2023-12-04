import { CoreEntity } from "commons/entities/core.entity";
import { Project } from "projects/entities/project.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "users/entities/user.entity";

@Entity({schema: process.env.DB_NAME})
export class Comment extends CoreEntity{

    // 댓글 내용
    @Column('text')
    content: string;

    /**
     * 대댓글 기능
     * 대댓글 기능을 위해 부모 댓글을 지정한다.
     * 부모 댓글이 없으면 null
     * 부모 댓글이 있으면 부모 댓글의 id
     */
    @ManyToOne(() => Comment, (comment) => comment.children, { 
        nullable: true, 
        onDelete: 'CASCADE' 
    })
    @JoinColumn({ name: 'parentId' })
    parent: Comment;

    /**
     * 대댓글 기능
     * 대댓글 기능을 위해 자식 댓글을 지정한다.
     * 자식 댓글이 없으면 null
     * 자식 댓글이 있으면 자식 댓글의 id
     */
    @OneToMany(() => Comment,(comment) => comment.parent, {
        nullable: true, 
        eager: true
    })
    children: Comment[];

    // 좋아요 수
    @Column({ default: 0 })
    likes: number;

    // 싫어요 수
    @Column({ default: 0 })
    dislikes: number;

    /**
     * 댓글:프로젝트 = N:1
     * 
     */
    @ManyToOne(() => Project, (project) => project.comments, { 
        onDelete: 'CASCADE' 
    })
    @JoinColumn({ name: 'projectId' })
    project: Project;

    /**
     * 댓글:유저 = N:1
     */
    @ManyToOne(() => User, (user) => user.comments, {
        onDelete: 'CASCADE',
        eager: true
    })
    user: User;

}
