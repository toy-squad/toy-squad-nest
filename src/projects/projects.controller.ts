import { Body, Controller, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateNewProjectRequestDto } from './dtos/requests/create-new-project-request.dto';

@Controller('project')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * 물리적으로 먼저 프로젝트 객체생성 확인후에
   * 가드/미들웨어/인터셉터 넣기
   * */
  @Post()
  async createNewProject(@Body() requestDto: CreateNewProjectRequestDto) {}
}
