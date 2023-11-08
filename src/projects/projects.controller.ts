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
import { ApiBody, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Project } from './entities/project.entity';

@ApiTags('project')
@Controller('project')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({ summary: '프로젝트 단건 조회' })
  @ApiResponse({  status: 200, description: '프로젝트 단건 조회 성공.', type: Project})
  @ApiParam({ name: 'id', description: '프로젝트 아이디', required: true })
  @Get(':id')
  async findOneProject(
    @Param('id') id: string,
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    try {
      const project = await this.projectsService.findOneProject(id);
      return response.status(HttpStatus.OK).json(project);

    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: '프로젝트 조회에 실패했습니다.',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: '프로젝트 목록 조회' })
  @ApiResponse({status: 200, description: '프로젝트 목록 조회 성공.', type: [Project]})
  @ApiQuery({ name: 'page', description: '페이지 번호',type: Number, required: false })
  @ApiQuery({ name: 'limit', description: '페이지당 데이터 갯수', type: Number, required: false })
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

  @ApiProperty({ description: '프로젝트 생성' })
  @ApiResponse({ status: 201, description: '프로젝트 생성 성공.', type: Project })
  @ApiBody({ type: CreateNewProjectRequestDto })
  @Post()
  async createNewProject(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    try {
      const reqDto: CreateNewProjectRequestDto = {
        userId: request.user.userId,
        ...request.body
      };
  
      const newProject = await this.projectsService.createNewProject(reqDto);
      
      return response.status(HttpStatus.OK).json(newProject);
    } catch (error) {

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: '프로젝트 생성에 실패했습니다.',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: '프로젝트 수정' })
  @ApiResponse({ status: 200, description: '프로젝트 수정 성공.', type: Project })
  @ApiBody({ type: UpdateProjectRequestDto })
  @Patch()
  async updateProject(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    try {

      const reqDto: UpdateProjectRequestDto = {
        userId: request.user.userId,
        ...request.body
      };
      
      const updatedProject = await this.projectsService.updateProject(reqDto);
      return response.status(HttpStatus.OK).json(updatedProject);
    
    } catch (error) {

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: '프로젝트 수정에 실패했습니다.',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: '프로젝트 삭제' })
  @ApiResponse({ status: 200, description: '프로젝트 삭제 성공.', type: Project })
  @ApiBody({ type: UpdateProjectRequestDto })
  @Delete()
  async deleteProject(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    try {
      const reqDto: UpdateProjectRequestDto = {
        userId: request.user.userId,
        ...request.body
      };
  
      const deleteProject = await this.projectsService.softDeleteProject(reqDto);
      return response.status(HttpStatus.OK).json(deleteProject);
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: '프로젝트 삭제에 실패했습니다.',
        error: error.message,
      });
    }
  }
}
