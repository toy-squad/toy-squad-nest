import { Injectable } from '@nestjs/common';
import { ProjectsRepository } from './projects.repository';
import { CreateNewProjectRequestDto } from './dtos/requests/create-new-project.dto';
import { UpdateProjectRequestDto } from './dtos/requests/update-project-request.dto';
import { RoleRepository } from '../role/role.repository';
import { UsersRepository } from '../users/users.repository';
import { GetProjectsRequestDto } from './dtos/requests/get-projects-request.dto';
import { GetProjectsResponseDto } from './dtos/response/get-projects-response.dto';
import { AwsService } from 'aws/aws.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly projectsRepository: ProjectsRepository,
    private readonly roleRepository: RoleRepository,
    private readonly awsService: AwsService,
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
      const role = await this.roleRepository.findOneRole({
        project: await this.projectsRepository.findOneProject(
          requestDto.projectId,
        ),
        user: await this.userRepository.findOneUser({
          userId: requestDto.userId,
        }),
      });

      if (role === 'M') {
        throw new Error('권한이 없습니다.');
      }

      return await this.projectsRepository.updateProject(requestDto);
    } catch (error) {
      throw error;
    }
  }

  async softDeleteProject(requestDto: UpdateProjectRequestDto) {
    try {
      const role = await this.roleRepository.findOneRole({
        project: await this.projectsRepository.findOneProject(
          requestDto.projectId,
        ),
        user: await this.userRepository.findOneUser({
          userId: requestDto.userId,
        }),
      });

      if (role === 'M') {
        throw new Error('권한이 없습니다.');
      }

      const projectId = requestDto.projectId;

      return await this.projectsRepository.softDeleteProject(projectId);
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

  async getProjects(
    reqDto: GetProjectsRequestDto,
  ): Promise<GetProjectsResponseDto> {
    try {
      const { page, limit } = reqDto;
      const [projects, total] = await this.projectsRepository.getProjects(
        reqDto,
      );

      return {
        data: projects,
        count: total,
        page,
        limit,
      };
    } catch (error) {
      throw error;
    }
  }
}
