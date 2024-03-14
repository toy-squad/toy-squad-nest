import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, Min } from 'class-validator';
import { PaginationQueryDto } from 'commons/dtos/pagination-query-dto';
import { Project } from 'projects/entities/project.entity';
import { User } from 'users/entities/user.entity';
import { Comment } from 'comment/entities/comment.entity';
import { ApiProperty } from '@nestjs/swagger';

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

export class CreateCommentRequestDto {
  // 댓글내용
  @IsNotEmpty()
  content: string;

  // 프로젝트 ID
  @IsNotEmpty()
  projectId: string;
}

/**
 * CommentType - 댓글타입
 * - C : 댓글
 * - R : 대댓글
 * - M : 대댓글에 멘션
 */
export type CommentType = 'C' | 'R' | 'M';
export class CreateCommentServiceDto extends PartialType(CommentDto) {
  // 댓글 타입
  @IsNotEmpty()
  commentType: CommentType;

  // 부모댓글 아이디
  @IsOptional()
  parentCommentId?: string;

  // 멘션 대상 댓글 아이디
  @IsOptional()
  mentionTargetCommentId?: string;
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
  @Min(5)
  content: string;

  // 부모댓글
  @IsOptional()
  parentComment?: Comment;

  // 멘션 대상 댓글 아이디
  @IsOptional()
  mentionTargetComment?: Comment;
}

/**
 * CommentUpdateType - 댓글 수정 타입
 * - COMMENT  : 댓글 내용 수정
 * - LIKE     : 좋아요 수 증가
 * - DISLIKE  : 싫어요 수 증가
 */
export type CommentUpdateType = 'COMMENT' | 'LIKE' | 'DISLIKE';
export class UpdateCommentDto {
  @ApiProperty({
    description: '작성자 아이디',
    required: true,
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: '코멘트 아이디',
    required: true,
  })
  @IsNotEmpty()
  commentId: string;

  // 업데이트 타입
  @ApiProperty({
    description: `코멘트 수정 타입
    COMMENT: 코멘트 내용 수정 <br>
    LIKE: 코멘트 좋아요 반영 <br>
    DISLIKE: 코멘트 싫어요 반영 <br>`,
    required: true,
  })
  @IsNotEmpty()
  commentUpdateType: CommentUpdateType;

  @ApiProperty({
    description: 'commentUpdateType이 COMMENT 일 경우, 수정할 코멘트 내용',
  })
  @IsOptional()
  newContent?: string;
}

export class DeleteCommentDto {
  @ApiProperty({
    description: '코멘트 작성자 아이디',
    required: true,
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: '삭제할 코멘트 아이디',
    required: true,
  })
  @IsNotEmpty()
  commentId: string;
}

export class GetAllCommentsDto extends PartialType(PaginationQueryDto) {
  // 프로젝트 모집공고 아이디
  @IsNotEmpty()
  projectId: string;
}

export interface GetAllCommentsResponseDto {
  comment_id?: string; // 코멘트 아이디
  user_id?: string; // 코멘트 작성자 아이디(유저아이디)
  user_email?: string; // 코멘트 작성자 이메일
  user_name?: string; // 코멘트 작성자 이름
  user_img_url?: string; // 코멘트 작성자 프로필 이미지 URL
  project_id?: string; // 프로젝트 아이디
  comment_type?: CommentType; // 코멘트 타입 (C: 댓글, R: 답글, M: 멘션답글)
  content?: string; // 코멘트 내용
  likes?: number; // 좋아요수
  dislikes?: number; // 좋아요수
  created_at?: string; // 코멘트 생성일자
  deleted_at?: string; // 코멘트 삭제일자
}

export class findCommentByCommentIdRepositoryDto {
  @ApiProperty({
    description: '검색할 코멘트 아이디',
    required: true,
  })
  @IsNotEmpty()
  commentId: string;

  @ApiProperty({
    description: '코멘트 타입(C: 댓글 | R: 댓글의 답글 | M: 멘션 답글)',
  })
  @IsOptional()
  commentType?: CommentType;
}

export class findAllReplyAndMentionedCommentsRepositoryDto {
  @ApiProperty({
    description: '검색 부모 코멘트 아이디',
    required: true,
  })
  parentCommentId: string;
}

export class MyPageCommentsResponseDto {
  comment_id: string;
  comment_type: CommentType;
  comment_content: string;
  project_id: string;
  project_name: string;
  created_at: string;
  parent_comment_author?: string;
  parent_comment_content?: string;
}
