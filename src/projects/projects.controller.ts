import {
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
import RequestWithUser from 'auth/interfaces/request-with-user.interface';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetProjectsRequestDto } from './dtos/requests/get-projects-request.dto';

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

  // 프로젝트 1개 조회
  @ApiOperation({
    summary: '단일 프로젝트 조회 API',
    description: '프로젝트 id로 단일 프로젝트 조회 API',
  })
  @Get(':id')
  async findOneProject(
    @Param('id') id: string,
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const project = await this.projectsService.findOneProject(id);
    return response.json(project);
  }

  // 프로젝트 리스트 조회
  @ApiOperation({
    summary: '프로젝트 리스트 조회 및 검색 API',
    description: '프로젝트 리스트 조회 & 검색조건에 맞는 프로젝트 조회',
  })
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

  // 프로젝트 생성
  @ApiOperation({
    summary: '프로젝트 생성 API',
    description: '프로젝트 생성 API',
  })
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

  // 프로젝트 수정
  @ApiOperation({
    summary: '프로젝트 수정 API',
    description: '프로젝트 수정 API',
  })
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

  // 프로젝트 삭제
  @ApiOperation({
    summary: '프로젝트 삭제 API',
    description: '프로젝트 id로 해당 프로젝트 삭제 API',
  })
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
