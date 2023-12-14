import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { CommentRepository } from './comment.repository';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  // 댓글 작성 
  async createComment(dto: CreateCommentDto) {
    try {
      await this.commentRepository.createAndSave();
    } catch (error) {}
  }

  async findAllCommentsByProjectId() {
    return await this.commentRepository.findAllCommentsByProjectWithPagination();
  }

  async getAllReplyCommentsByCommentId() {
    return await this.commentRepository.findCommentById();
  }

  async updateComment(dto: UpdateCommentDto) {
    const { commentUpdateType, commentId } = dto;
    try {
      switch (commentUpdateType) {
        case 'COMMENT': // 댓글 내용 수정
          await this.commentRepository.updateCommentContent();
          break;
        case 'LIKE': // 댓글 좋아요 증가
          await this.commentRepository.incrementLikes(commentId);
        case 'DISLIKE': // 댓글 싫어요
          await this.commentRepository.incrementDislikes(commentId);
        default:
          throw new BadRequestException(
            'commentUpdateType은 COMMENT / LIKE / DISLIKE 만 업데이트 가능합니다.',
          );
      }
    } catch (error) {
      throw error;
    }
  }

  async removeComment(commentId: string) {
    try {
    } catch (error) {}
    return await this.commentRepository.removeComment(commentId);
  }
}
