import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'projects/entities/project.entity';

@Injectable()
export class CommentRepository{
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

    // 게시물 ID에 따른 댓글 조회 (페이징 포함)
    async findCommentsByPostWithPagination(
        projectId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<[Comment[], number]> {
        try {
            const project = await this.entityManager.findOne(Project, projectId);
            const [comments, total] = await this.repo.findAndCount({
                where: { project: project, deletedAt: null },
                relations: ['user', 'parent'],
                order: { createdAt: 'DESC' },
                take: limit,
                skip: limit * (page - 1),
            });
            return [comments, total];
        } catch (error) {
        this.logger.error(`Failed to get comments for post ${projectId}`, error.stack);
        throw new Error(`Could not find comments for post ${projectId}`);
        }
    }

    // 댓글 ID로 조회
    async findCommentById(id: string): Promise<Comment | undefined> {
        try {
        return await this.repo.findOne({
            where: { id, deletedAt: null },
            relations: ['user', 'parent', 'children'],
        });
        } catch (error) {
        this.logger.error(`Failed to find comment by id ${id}`, error.stack);
        throw new Error(`Could not find comment by id ${id}`);
        }
    }

    // 댓글 생성 및 저장
    async createAndSave(commentData: Partial<Comment>): Promise<Comment> {
        try {
        const comment = this.repo.create(commentData);
        await this.repo.save(comment);
        return comment;
        } catch (error) {
        this.logger.error(`Failed to create a new comment`, error.stack);
        throw new Error(`Could not create a new comment`);
        }
    }

    // 댓글 Soft Delete
    async softDeleteComment(id: number): Promise<void> {
        try {
        await this.repo.softDelete(id);
        } catch (error) {
        this.logger.error(`Failed to soft delete comment ${id}`, error.stack);
        throw new Error(`Could not soft delete comment with id ${id}`);
        }
    }

    // 댓글 좋아요 수 증가
    async incrementLikes(id: string): Promise<void> {
        try {
        await this.repo.increment({ id }, 'likes', 1);
        } catch (error) {
        this.logger.error(`Failed to increment likes for comment ${id}`, error.stack);
        throw new Error(`Could not increment likes for comment ${id}`);
        }
    }

    // 댓글 싫어요 수 증가
    async incrementDislikes(id: string): Promise<void> {
        try {
        await this.repo.increment({ id }, 'dislikes', 1);
        } catch (error) {
        this.logger.error(`Failed to increment dislikes for comment ${id}`, error.stack);
        throw new Error(`Could not increment dislikes for comment ${id}`);
        }
    }

    // 댓글 내용 업데이트
    async updateCommentContent(id: string, content: string): Promise<Comment> {
        try {
        await this.repo.update(id, { content });
        return await this.findCommentById(id);
        } catch (error) {
        this.logger.error(`Failed to update comment ${id}`, error.stack);
        throw new Error(`Could not update comment with id ${id}`);
        }
    }
}
