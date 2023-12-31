import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'commons/dtos/pagination-query-dto';
import { Project } from 'projects/entities/project.entity';
import { User } from 'users/entities/user.entity';

export class CommentDto {
  // 댓글내용
  @IsNotEmpty()
  content: string;

  // 댓글작성자 ID
  @IsNotEmpty()
  userId: string;

  // 프로젝트 ID
  @IsNotEmpty()
  projectId: string;
}

/**
 * CommentType - 댓글타입
 * - C : 댓글
 * - R : 대댓글
 * - H : 대댓글에 해시태그
 */
export type CommentType = 'C' | 'R' | 'H';
export class CreateCommentRequestDto extends PartialType(CommentDto) {
  // 댓글 타입
  @IsNotEmpty()
  commentType: CommentType;

  // 부모댓글 아이디
  @IsOptional()
  parentCommentId?: string;

  // 해시태그 대상 댓글 아이디
  @IsOptional()
  hashtagTargetCommentId?: string;
}

export class CreateCommentDto {
  // 댓글타입
  @IsNotEmpty()
  commentType: CommentType;

  // 프로젝트
  @IsNotEmpty()
  project: Project;

  // 코멘트 작성자
  @IsNotEmpty()
  commentAuthor: User;

  // 코멘트 내용
  @IsNotEmpty()
  content: string;

  // 부모댓글
  @IsOptional()
  parentComment?: Comment;

  // 해시태그 대상 댓글 아이디
  @IsOptional()
  hashtagTargetAuthor?: User;
}

/**
 * CommentUpdateType - 댓글 수정 타입
 * - COMMENT  : 댓글 내용 수정
 * - LIKE     : 좋아요 수 증가
 * - DISLIKE  : 싫어요 수 증가
 */
export type CommentUpdateType = 'COMMENT' | 'LIKE' | 'DISLIKE';
export class UpdateCommentDto {
  // 작성자 아이디
  @IsNotEmpty()
  userId: string;

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

export class DeleteCommentDto {
  // 작성자 아이디
  @IsNotEmpty()
  userId: string;

  // 코멘트 아이디
  @IsNotEmpty()
  commentId: string;
}

export class GetAllCommentsDto extends PartialType(PaginationQueryDto) {
  // 프로젝트 모집공고 아이디
  @IsNotEmpty()
  projectId: string;
}
