import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateCommentDto,
  DeleteCommentDto,
  UpdateCommentDto,
} from './dto/comment.dto';
import { CommentRepository } from './comment.repository';
import { UsersRepository } from 'users/users.repository';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userRepository: UsersRepository,
  ) {}

  // 댓글 작성
  async createComment(dto: CreateCommentDto) {
    try {
      await this.commentRepository.createAndSave();
    } catch (error) {
      throw error;
    }
  }

  async findAllCommentsByProjectId() {
    return await this.commentRepository.findAllCommentsByProjectWithPagination();
  }

  async getAllReplyCommentsByCommentId() {
    return await this.commentRepository.findCommentById();
  }

  async updateComment(dto: UpdateCommentDto) {
    const { commentUpdateType, commentId, userId } = dto;
    try {
      // 본인이 작성한 글인지 검사한다.
      const isAuthor =
        (await this.checkCommentAuthor(commentId, userId)) ?? false;

      switch (commentUpdateType) {
        case 'COMMENT': {
          if (!isAuthor) {
            // 댓글작성자는 자신이 작성한 댓글내용을 수정할 수 있다.
            throw new BadRequestException(
              '작성자만 댓글 내용 수정이 가능합니다.',
            );
          }

          // 댓글 내용 수정
          await this.commentRepository.updateCommentContent();
          break;
        }
        case 'LIKE': {
          if (isAuthor) {
            // 댓글 작성자는 자신이 작성한 댓글에 좋아요 할 수 없다.
            throw new BadRequestException(
              '자신이 작성한 댓글에 좋아요를 할 수 없습니다.',
            );
          }

          // 댓글 좋아요 증가
          await this.commentRepository.incrementLikes(commentId);
          break;
        }
        case 'DISLIKE': {
          if (isAuthor) {
            // 댓글작성자는 자신이 작성한 댓글에 싫어요 할 수 없다.
            throw new BadRequestException(
              '자신이 작성한 댓글에 싫어요를 할수 없습니다.',
            );
          }

          // 댓글 싫어요
          await this.commentRepository.incrementDislikes(commentId);
          break;
        }
        default:
          throw new BadRequestException(
            'commentUpdateType은 COMMENT / LIKE / DISLIKE 만 업데이트 가능합니다.',
          );
      }
    } catch (error) {
      throw error;
    }
  }

  async removeComment(dto: DeleteCommentDto) {
    const { commentId, userId } = dto;
    try {
      // 본인이 작성한 글인지 검사한다.
      const isAuthor = await this.checkCommentAuthor(commentId, userId);

      if (!isAuthor) {
        // 댓글작성자는 자신이 작성한 댓글내용을 삭제할 수 있다.
        throw new BadRequestException('작성자만 댓글 삭제가 가능합니다.');
      }

      return await this.commentRepository.removeComment(commentId);
    } catch (error) {
      throw error;
    }
  }

  async checkCommentAuthor(
    commentId: string,
    userId: string, // 로그인한 유저아이디
  ): Promise<boolean> {
    try {
      // 댓글 작성자의 정보를 구한다.
      const comment = await this.commentRepository.findCommentById(commentId);
      const commentAuthorId = comment.author.id;

      // 로그인한 유저아이디와 코멘트작성자 아이디가 일치한지 확인한다.
      return commentAuthorId === userId;
    } catch (error) {
      throw error;
    }
  }
}
