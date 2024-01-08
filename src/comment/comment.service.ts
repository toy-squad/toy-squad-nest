import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCommentServiceDto,
  DeleteCommentDto,
  GetAllCommentsDto,
  UpdateCommentDto,
} from './dto/comment.dto';
import { CommentRepository } from './comment.repository';
import { UsersRepository } from 'users/users.repository';
import { ProjectsRepository } from 'projects/projects.repository';
import { Project } from 'projects/entities/project.entity';
import { User } from 'users/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userRepository: UsersRepository,
    private readonly projectRepository: ProjectsRepository,
  ) {}

  // 댓글 작성
  async createComment(dto: CreateCommentServiceDto) {
    const { projectId, userId, commentType } = dto;
    let parentComment = undefined;
    let hashtagTargetAuthor = undefined;

    try {
      // userId 로 작성자 회원정보 데이터를 구한다.
      const commentAuthorUser = await this.userRepository.findOneUser({
        userId: userId,
        allowPassword: false,
      });
      if (!commentAuthorUser) {
        throw new BadRequestException('잘못된 접근입니다.');
      }

      // projectId 로 프로젝트 모집공고 데이터를 구한다.
      const project = await this.projectRepository.findOneProject(projectId);
      if (!project) {
        throw new NotFoundException('프로젝트가 존재하지 않습니다.');
      }

      // 부모댓글
      if (commentType === 'R') {
        // 부모댓글을 구한다
        parentComment = await this.commentRepository.findCommentById(
          dto.parentCommentId,
        );
        if (!parentComment) {
          throw new NotFoundException('댓글이 존재하지 않습니다.');
        }
      }

      // 해시태그
      else if (commentType === 'H') {
        // 부모댓글을 구한다.
        parentComment = await this.commentRepository.findCommentById(
          dto.parentCommentId,
        );

        // 해시태그 댓글을 구한다
        const hashTagTargetComment =
          await this.commentRepository.findCommentById(
            dto.hashtagTargetCommentId,
          );

        // 해시태그의 작성자 유저아이디를 구한다.
        hashtagTargetAuthor = await this.userRepository.findOneUser(
          hashTagTargetComment.author,
        );
      }

      await this.commentRepository.createAndSave({
        commentType: commentType,
        project: project,
        commentAuthor: commentAuthorUser,
        content: dto.content,
        parentComment: parentComment,
        hashtagTargetAuthor: hashtagTargetAuthor,
      });
    } catch (error) {
      throw error;
    }
  }

  async findAllCommentsByProjectId(dto: GetAllCommentsDto) {
    return await this.commentRepository.findAllCommentsByProjectWithPagination(
      dto,
    );
  }

  async getAllReplyCommentsByCommentId(commentId: string) {
    // commentId에 해당하는 댓글이 있는지 확인
    // 대댓글들을 리턴한다
    const replyComments = await this.commentRepository.findCommentById(
      commentId,
    );
    return replyComments;
  }

  async updateComment(dto: UpdateCommentDto) {
    const { commentUpdateType, commentId, userId, newContent } = dto;
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
          if (
            newContent.replace(' \t\n', '').length === 0 ||
            newContent.length < 10
          ) {
            throw new BadRequestException('최소 10자를 입력해주세요.');
          }
          await this.commentRepository.updateCommentContent(
            commentId,
            newContent,
          );
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
