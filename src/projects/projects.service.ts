import { Injectable } from '@nestjs/common';
import { ProjectsRepository } from './projects.repository';
import { CreateNewProjectRequestDto } from './dtos/requests/create-new-project.dto';
import { UpdateProjectRequestDto } from './dtos/requests/update-project-request.dto';
import { RoleRepository } from 'role/role.repository';
import { User } from 'users/entities/user.entity';
import { UsersRepository } from 'users/users.repository';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly projectsRepository: ProjectsRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async createNewProject(requestDto: CreateNewProjectRequestDto) {
    try {
      const { userId, role, ...newProjectInfo } = requestDto;

      // 유저아이디에 맞는 객체 찾기
      const user = await this.userRepository.findOneUser({ userId: userId });

      // 프로젝트 생성
      const newProject = await this.projectsRepository.createNewProject({
        user: user,
        ...newProjectInfo,
      });

      // 멤버 권한 추가 - 생성자권한
      await this.roleRepository.createRole({
        project: newProject,
        user: user,
        role: role ?? 'G',
      });

      return newProject;
    } catch (error) {
      throw error;
    }
  }

  async updateProject(requestDto: UpdateProjectRequestDto) {
    try {
      return await this.projectsRepository.updateProject(requestDto);
    } catch (error) {
      throw error;
    }
  }

  async softDeleteProject(id: string) {
    try {
      return await this.projectsRepository.softDeleteProject(id);
    } catch (error) {
      throw error;
    }
  }

  async findOneProject(id: string) {
    try {
      return await this.projectsRepository.findOneProject(id);
    } catch (error) {
      throw error;
    }
  }

  async findMultipleProjects() {
    try {
      return await this.projectsRepository.findAll();
    } catch (error) {
      throw error;
    }
  }
}
