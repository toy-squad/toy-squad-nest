import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { User } from 'users/entities/user.entity';

export class CommentDto {
  // 댓글내용
  content: string;

  // 댓글작성자 ID
  user: string;

  // 프로젝트 ID
  projectId: string;
}

/**
 * CommentType - 댓글타입
 * - C : 댓글
 * - R : 대댓글
 * - H : 대댓글에 해시태그
 */
export type CommentType = 'C' | 'R' | 'H';
export class CreateCommentDto extends PartialType(CommentDto) {
  // 댓글 타입
  @IsNotEmpty()
  commentType: CommentType;

  // 부모댓글
  @IsNotEmpty()
  parent: Comment;

  // 해시태그 대상 댓글
  @IsOptional()
  hashtagTarget?: Comment;
}

/**
 * CommentUpdateType - 댓글 수정 타입
 * - COMMENT  : 댓글 내용 수정
 * - LIKE     : 좋아요 수 증가
 * - DISLIKE  : 싫어요 수 증가
 */
export type CommentUpdateType = 'COMMENT' | 'LIKE' | 'DISLIKE';
export class UpdateCommentDto {
  // 코멘트 아이디
  @IsNotEmpty()
  commentId: string;

  // 업데이트 타입
  @IsNotEmpty()
  commentUpdateType: CommentUpdateType;

  // 수정된 코멘트내용
  @IsOptional()
  newContent?: string;
}
