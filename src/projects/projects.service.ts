import { Injectable } from '@nestjs/common';
import { ProjectsRepository } from './projects.repository';
import { CreateNewProjectRequestDto } from './dtos/requests/create-new-project-request.dto';
import { UpdateProjectRequestDto } from './dtos/requests/update-project-request.dto';
import { RoleRepository } from 'role/role.repository';
import { User } from 'users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async createProject(requestDto: CreateNewProjectRequestDto) {
    try {
      const {userId} = requestDto;
      const newProject = await this.projectsRepository.createProject(requestDto);
      const role  = 'G';

      const user = new User();
      user.id = userId;

      await this.roleRepository.createGenerateRole({role, project: newProject, user});
    } catch (error) {
      throw error;
    }
  }

  async updateProject(id: string, requestDto: UpdateProjectRequestDto) {
    try {
      const newProject = await this.projectsRepository.updateProject(
        id,
        requestDto,
      );
    } catch (error) {}
  }

  async softDeleteProject(id: string) {
    try {
      const newProject = await this.projectsRepository.softDeleteProject(id);
    } catch (error) {}
  }

  async findOneProject(id: string) {
    try {
      return await this.projectsRepository.findOneProject(id);
    } catch (error) {
      throw error;
    }
  }
}
