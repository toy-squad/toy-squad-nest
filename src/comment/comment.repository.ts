import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'projects/entities/project.entity';

@Injectable()
export class CommentRepository {
  private logger = new Logger('CommentRepository');

  private queryRunner;
  private entityManager;

  constructor(
    @InjectRepository(Comment)
    private readonly repo: Repository<Comment>,
  ) {
    this.queryRunner = repo.queryRunner;
    this.entityManager = repo.manager;
  }

  // 댓글 생성 및 저장
  async createAndSave() {
    // TODO
    const comment = this.repo.create();
    await this.repo.save(comment);
    return comment;
  }

  // 게시물 ID에 따른 댓글 조회 (페이징 포함)
  async findAllCommentsByProjectWithPagination(
    projectId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<[Comment[], number]> {
    // TODO
    const project = await this.entityManager.findOne(Project, projectId);
    const [comments, total] = await this.repo.findAndCount({
      where: { project: project, deletedAt: null },
      relations: ['user', 'parent'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: limit * (page - 1),
    });
    return [comments, total];
  }

  // 댓글 ID로 조회
  async findCommentById(id: string) {
    // TODO
    return await this.repo.findOne({
      where: { id, deletedAt: null },
      relations: ['user', 'parent', 'children'],
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
    await this.repo.softDelete(id);
  }
}
