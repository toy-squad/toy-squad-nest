import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentRepository } from './comment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  exports: [TypeOrmModule],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository]
})
export class CommentModule {}
