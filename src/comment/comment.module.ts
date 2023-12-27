import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentRepository } from './comment.repository';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'users/users.module';
import { ProjectModule } from 'projects/project.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    ProjectModule,
    TypeOrmModule.forFeature([Comment]),
  ],
  exports: [TypeOrmModule],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
})
export class CommentModule {}
