import { DataSource, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'projects/entities/project.entity';
import { CreateCommentDto, GetAllCommentsDto } from './dto/comment.dto';

@Injectable()
export class CommentRepository {
  private logger = new Logger('CommentRepository');

  constructor(
    @InjectRepository(Comment) private readonly repo: Repository<Comment>,
    private readonly dataSource: DataSource,
  ) {}

  // 댓글 생성 및 저장
  async createAndSave(dto: CreateCommentDto) {
    const { content, project, commentAuthor } = dto;
    try {
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Comment)
        .values({
          content: content,
          project: project,
          author: commentAuthor,
        })
        .execute();
    } catch (error) {
      throw new InternalServerErrorException(error, error.stack);
    }
  }

  // 게시물 ID에 따른 댓글 조회 (페이징 포함)
  async findAllCommentsByProjectWithPagination(dto: GetAllCommentsDto) {
    const { page, take, projectId } = dto;

    // 프로젝트를 찾는다.
    const project = await this.dataSource
      .getRepository(Project)
      .createQueryBuilder('project')
      .where('project.id = :projectId', { projectId: projectId });

    // 프로젝트의 댓글을 찾는다.
    const comments = await this.dataSource
      .getRepository(Comment)
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'user')
      .leftJoinAndSelect('comment.project', 'project')
      .where('project.id = :projectId', { projectId: projectId })
      .orderBy('comment.createdAt', 'DESC')
      .take(take)
      .skip(take * (page - 1));

    return comments;
  }

  // 댓글 ID로 조회
  async findCommentById(comment_id: string) {
    return await this.repo.findOne({
      where: { id: comment_id, deletedAt: null },
      relations: ['user', 'project'],
    });
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
    await this.repo.delete(id);
  }
}
