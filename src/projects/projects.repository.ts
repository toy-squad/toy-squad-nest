import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { CreateNewProjectDto } from './dtos/requests/create-new-project.dto';
import { UpdateProjectRequestDto } from './dtos/requests/update-project-request.dto';
import { GetProjectsRequestDto } from './dtos/requests/get-projects-request.dto';

@Injectable()
export class ProjectsRepository {
  private queryRunner;
  private entityManager;

  constructor(
    @InjectRepository(Project)
    private readonly repo: Repository<Project>,
  ) {
    this.queryRunner = repo.queryRunner;
    this.entityManager = repo.manager;
  }

  async getProjects(dto: GetProjectsRequestDto): Promise<[Project[], number]> {
    const { page, 
            limit, 
            firstPosition, 
            secondPosition, 
            contactType, 
            memberCount, 
            recruitStartDate,
            recruitEndDate,
            startDate,
            endDate, 
            place, field, platform } = dto;

    const query = this.repo.createQueryBuilder('project');

    if (firstPosition) {
      query.andWhere('project.firstPosition IN (:...firstPosition)', { firstPosition });
    }

    if (secondPosition) {
      query.andWhere('project.secondPosition IN (:...secondPosition)', { secondPosition });
    }

    if (contactType) {
      query.andWhere('project.contactType = :contactType', { contactType });
    }

    if (memberCount) {
      query.andWhere('project.memberCount = :memberCount', { memberCount });
    }

    if (recruitStartDate && recruitEndDate) {
      query.andWhere('Date(project.recruitStartDate) <= Date(:recruitEndDate) AND Date(project.recruitEndDate) >= Date(:recruitStartDate)', { recruitStartDate, recruitEndDate });
    }

    if (startDate && endDate) {
      query.andWhere('Date(project.start_date) <= Date(:endDate) AND Date(project.end_date) >= Date(:startDate)', { startDate, endDate });
    }

    if (place) {
      query.andWhere('project.place = :place', { place });
    }

    if (field) {
      query.andWhere('project.field IN (:...field)', { field });
    }

    if (platform) {
      query.andWhere('project.platform IN (:...platform)', { platform });
    }

    query.skip((page - 1) * limit);
    query.take(limit);

    return await query.getManyAndCount();
  }

  async findOneProject(id: string): Promise<Project> {
    try {
      return this.repo.findOneBy({ id: id });
    } catch (error) {
      throw error;
    }
  }

  async createNewProject(dto: CreateNewProjectDto) {
    return await this.repo.save(dto);
  }

  async updateProject(dto: UpdateProjectRequestDto) {
    return await this.repo.save(dto);
  }

  async softDeleteProject(id: string) {
    await this.repo.softDelete(id);
  }

  async findAll() {
    await this.repo.find();
  }
}
