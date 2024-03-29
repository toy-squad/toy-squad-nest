import { DataSource, In, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'projects/entities/project.entity';
import {
  CreateCommentDto,
  GetAllCommentsDto,
  GetAllCommentsResponseDto,
  findAllReplyAndMentionedCommentsRepositoryDto,
  findCommentByCommentIdRepositoryDto,
} from './dto/comment.dto';

@Injectable()
export class CommentRepository {
  private logger = new Logger('CommentRepository');

  constructor(
    @InjectRepository(Comment) private readonly repo: Repository<Comment>,
    private readonly dataSource: DataSource,
  ) {}

  // 코멘트 ID로 코멘트 찾기
  async findCommentById(dto: findCommentByCommentIdRepositoryDto) {
    try {
      const { commentId, commentType } = dto;
      const query = this.dataSource
        .getRepository(Comment)
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.author', 'user')
        .where('comment.id = :commentId', { commentId: commentId });

      if (commentType) {
        query.andWhere('comment.commentType = :commentType', {
          commentType: commentType,
        });
      }

      const comment = await query.getRawOne();
      return comment;
    } catch (error) {
      throw new InternalServerErrorException(error, error.stack);
    }
  }

  // 댓글 생성 및 저장
  async createAndSave(dto: CreateCommentDto) {
    const { content, project, commentAuthor, commentType } = dto;
    try {
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Comment)
        .values({
          content: content,
          project: project,
          author: commentAuthor,
          commentType: commentType,
          parent: dto.parentComment,
          mentionTarget: dto.mentionTargetComment,
        })
        .execute();
    } catch (error) {
      throw new InternalServerErrorException(error, error.stack);
    }
  }

  // 게시물 ID에 따른 댓글 조회 (페이징 포함)
  async findAllCommentsByProjectWithPagination(dto: GetAllCommentsDto) {
    const { page, take, projectId } = dto;

    // TODO : 커서기반 페이지네이션으로 변경예정
    // 프로젝트의 댓글을 찾는다.
    const comments = await this.dataSource
      .getRepository(Comment)
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'user')
      .leftJoinAndSelect('comment.project', 'project')
      .where('project.id = :projectId', { projectId: projectId })
      .andWhere('comment.commentType = :commentType', { commentType: 'C' })
      .orderBy('comment.createdAt', 'DESC')
      .take(take)
      .skip(take * (page - 1))
      .getRawMany();

    return comments;
  }

  async findAllReplyAndMentionedComments(
    dto: findAllReplyAndMentionedCommentsRepositoryDto,
  ) {
    // TODO : 커서기반 페이지네이션으로 변경예정
    const { parentCommentId } = dto;
    const replyComments = await this.dataSource
      .getRepository(Comment)
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'user')
      .where('comment.parentId = :parentCommentId', {
        parentCommentId: parentCommentId,
      })
      .andWhere("comment.commentType IN ('R', 'M')")
      .getRawMany();

    return replyComments;
    // return await this.repo.findOne({
    //   where: { id: comment_id, deletedAt: null },
    //   relations: ['user', 'project'],
    // });
  }

  // 댓글 좋아요 수 증가
  async incrementLikes(id: string) {
    await this.repo.increment({ id }, 'likes', 1);
  }

  // 댓글 싫어요 수 증가
  async incrementDislikes(id: string) {
    await this.repo.increment({ id }, 'dislikes', 1);
  }

  // 댓글 내용 수정
  async updateCommentContent(id: string, content: string) {
    await this.repo.update(id, { content });
  }

  // Delete
  async removeComment(id: string) {
    // 영구삭제
    // await this.repo.delete(id);

    // soft-delete
    await this.repo.softDelete(id);
  }

  // (마이페이지) 유저아이디로 코멘트 데이터 찾기
  async findCommentByUserId(userId: string) {
    try {
      // TODO : 커서기반 페이지네이션으로 변경예정
      const comments = await this.dataSource
        .getRepository(Comment)
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.author', 'user')
        .leftJoinAndSelect('comment.project', 'project')
        .select('comment.id') // 코멘트 아이디
        .addSelect('comment.commentType') // 코멘트타입
        .addSelect('comment.content') // 코멘트 내용
        .addSelect('comment.created_at') // 코멘트 생성일
        .addSelect('comment.mentionTarget') // 답글 멘션 대상자 아이디
        .addSelect('comment.parent') // 답글의 부모댓글 아이디
        .addSelect('project.id') // 프로젝트 아이디
        .addSelect('project.name') // 프로젝트명
        .where('comment.author = :userId', { userId: userId })
        .orderBy('comment.createdAt', 'DESC')
        .getRawMany();
      return comments;
    } catch (error) {
      throw error;
    }
  }
}
