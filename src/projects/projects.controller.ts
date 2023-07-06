import { Controller } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('project')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
}
