import { Injectable } from '@nestjs/common';
import { ProjectsRepository } from './projects.repository';
import { CreateNewProjectRequestDto } from './dtos/requests/create-new-project-request.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectsRepository: ProjectsRepository) {

  }

  async createProject(requestDto: CreateNewProjectRequestDto){
    try {
      const newProject = await this.projectsRepository.createProject(requestDto);
    } catch (error) {
      
    }
  }
}
