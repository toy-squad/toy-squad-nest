import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateNewProjectRequestDto } from './dtos/requests/create-new-project-request.dto';
import { UpdateProjectRequestDto } from './dtos/requests/update-project-request.dto';

@Controller('project')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * 물리적으로 먼저 프로젝트 객체생성 확인후에
   * 가드/미들웨어/인터셉터 넣기
   * */
  @Post()
  async generateNewProject(@Body() requestDto: CreateNewProjectRequestDto) {
    return await this.projectsService.createProject(requestDto);
  }

  @Patch('/:id')
  async updateProject(@Param('id') id: string, @Body() requestDto: UpdateProjectRequestDto) {
    return await this.projectsService.updateProject(id, requestDto);
  }

  @Delete('/:id')
  async deleteProject(@Param('id') id: string) {
    return await this.projectsService.softDeleteProject(id);
  }
}
