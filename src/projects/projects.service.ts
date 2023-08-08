import { Injectable } from '@nestjs/common';
import { ProjectsRepository } from './projects.repository';
import { CreateNewProjectRequestDto } from './dtos/requests/create-new-project-request.dto';
import { UpdateProjectRequestDto } from './dtos/requests/update-project-request.dto';

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

  async updateProject(id: string, requestDto: UpdateProjectRequestDto ){
    try {
      const newProject = await this.projectsRepository.updateProject(id, requestDto);
    } catch (error) {
      
    }
  }

  async softDeleteProject(id: string){
    try{
      const newProject = await this.projectsRepository.softDeleteProject(id);
    }catch(error){

    }
  }

  async findOneProject(id: string) {
    try {
      return await this.projectsRepository.findOneProject(id);
    } catch (error) {
      throw error;
    }
  }
}
