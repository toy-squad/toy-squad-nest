import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectsRepository } from './projects.repository';
import { RoleModule } from 'role/role.module';
import { UsersModule } from 'users/users.module';
import { CommentModule } from 'comment/comment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    RoleModule,
    UsersModule,
    CommentModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository],
  exports: [ProjectsService, ProjectsRepository],
})
export class ProjectModule {}
