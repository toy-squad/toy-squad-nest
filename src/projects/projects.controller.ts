import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { UpdateProjectRequestDto } from './dtos/requests/update-project-request.dto';
import RequestWithUser from 'auth/interfaces/request-with-user.interface';
import { Response } from 'express';
import { CreateNewProjectRequestDto } from './dtos/requests/create-new-project.dto';
import { GetProjectsRequestDto } from './dtos/requests/get-projects-request.dto';

@Controller('project')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get(':id')
  async findOneProject(
    @Param('id') id: string,
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const project = await this.projectsService.findOneProject(id);
    return response.json(project);
  }

  @Get('list')
  async getProjects(
    @Query() reqDto: GetProjectsRequestDto,
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    try {
      const projects = await this.projectsService.getProjects(reqDto);
      response.status(HttpStatus.OK).json(projects);
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: '프로젝트 목록 조회에 실패했습니다.',
        error: error.message,
      });
    }
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

  @Patch(':id')
  async updateProject(
    @Param('id') projectId: string,
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const userId = request.user.userId;
    const bodyInfo = request.body;

    const updatedProject = await this.projectsService.updateProject({
      projectId,
      userId,
      ...bodyInfo,
    });

    return response.json(updatedProject);
  }

  @Delete(':id')
  async deleteProject(
    @Param('id') projectId: string,
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const userId = request.user.userId;
    const bodyInfo = request.body;

    const deleteProject = await this.projectsService.softDeleteProject({
      projectId,
      userId,
      ...bodyInfo,
    });
    return response.json(deleteProject);
  }
}
