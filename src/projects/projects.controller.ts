import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { UpdateProjectRequestDto } from './dtos/requests/update-project-request.dto';
import RequestWithUser from 'auth/interfaces/request-with-user.interface';
import { Response } from 'express';
import { CreateNewProjectRequestDto } from './dtos/requests/create-new-project.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('프로젝트 API')
@Controller('project')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({
    summary: '복수 프로젝트 조회 API',
    description: '복수 프로젝트 조회 API',
  })
  @Get()
  async findMultipleProjects() {
    return await this.projectsService.findMultipleProjects();
  }

  @ApiOperation({
    summary: '단일 프로젝트 조회 API',
    description: '단일 프로젝트 조회 API',
  })
  @Get('/:id')
  async findOneProject(@Param('id') id: string) {
    return await this.projectsService.findOneProject(id);
  }

  @Post()
  async createNewProject(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const bodyInfo = request.body;
    const userId = request.user.userId;

    const newProject = await this.projectsService.createNewProject({
      userId: userId,
      ...bodyInfo,
    });
    return response.json(newProject);
  }

  @Patch('/:id')
  async updateProject(
    @Param('id') projectId: string,
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const userId = request.user.userId;
    const bodyInfo = request.body;

    await this.projectsService.updateProject({
      projectId: projectId,
      userId: userId,
      ...bodyInfo,
    });

    return response.json();
  }

  @Delete('/:id')
  async deleteProject(
    @Param('id') id: string,
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    await this.projectsService.softDeleteProject(id);
    return response.json();
  }
}
