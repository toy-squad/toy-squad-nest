import { CommentType } from 'comment/dto/comment.dto';
import { CoreEntity } from 'commons/entities/core.entity';
import { Project } from 'projects/entities/project.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'users/entities/user.entity';

@Entity({ schema: process.env.DB_NAME })
export class Comment extends CoreEntity {
  /** 댓글, 대댓글 모두 공통으로 갖는 필드 */
  // 댓글 내용
  @Column('text')
  content: string;

  // 좋아요 수
  @Column({ default: 0 })
  likes: number;

  // 싫어요 수
  @Column({ default: 0 })
  dislikes: number;

  // 댓글타입
  @Column({ default: 'C' })
  commentType: CommentType;

  /**
   * 댓글:프로젝트 = N:1
   *
   */
  @ManyToOne(() => Project, (project) => project.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  /**
   * 유저: 댓글작성자
   * 댓글:유저 = N:1
   */
  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
    eager: true,
  })
  author: User;

  // --------------------------------------------------------
  /**
   * 대댓글 기능
   * 대댓글 기능을 위해 부모 댓글을 지정한다.
   * 부모 댓글이 없으면 null
   * 부모 댓글이 있으면 부모 댓글의 id
   */
  @ManyToOne(() => Comment, (comment) => comment.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  parent: Comment;

  /**
   * 대댓글 기능
   * 대댓글 기능을 위해 자식 댓글을 지정한다.
   * 자식 댓글이 없으면 null
   * 자식 댓글이 있으면 자식 댓글의 id
   */
  @OneToMany(() => Comment, (comment) => comment.parent, {
    nullable: true,
    eager: true,
  })
  children: Comment[];

  /**
   * 대댓글 기능
   * - 대댓글에 댓글을 작성한경우
   * - 해시태그는 대댓글의 아이디를 참조한다
   */
  // TODO: hashtagTarget -> MentionTarget
  @OneToMany(() => Comment, (comment) => comment.hashtagTarget, {
    nullable: true,
  })
  hashtagComments: Comment[];

  // TODO: hashtagComments -> MentionedComments
  @ManyToOne(() => Comment, (comment) => comment.hashtagComments)
  @JoinColumn()
  hashtagTarget: Comment;
}
