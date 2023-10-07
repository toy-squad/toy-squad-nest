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
import { CreateNewProjectRequestDto } from './dtos/requests/create-new-project-request.dto';
import { UpdateProjectRequestDto } from './dtos/requests/update-project-request.dto';
import RequestWithUser from 'auth/interfaces/request-with-user.interface';
import { Response } from 'express';

@Controller('project')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * 물리적으로 먼저 프로젝트 객체생성 확인후에
   * 가드/미들웨어/인터셉터 넣기
   * 프로젝트 리스트 조회
   * 타입스크립트
   * */

  @Get('/:id')
  async findOneProject(@Param('id') id: string) {
    return await this.projectsService.findOneProject(id);
  }

  /** /api/project */
  @Post()
  async generateNewProject(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const bodyInfo = request.body;
    const userId = request.user.userId;
    
    await this.projectsService.createProject({...bodyInfo, userId});
    return response.json();
  }

  @Patch('/:id')
  async updateProject(
    @Param('id') id: string,
    @Body() requestDto: UpdateProjectRequestDto,
  ) {
    return await this.projectsService.updateProject(id, requestDto);
  }

  @Delete('/:id')
  async deleteProject(@Param('id') id: string) {
    return await this.projectsService.softDeleteProject(id);
  }
}
