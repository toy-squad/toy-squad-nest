import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Brackets, Repository } from 'typeorm';
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
            place, field, platform, keyword } = dto;

    const query = this.repo.createQueryBuilder('project');

    if (keyword) {
      query.andWhere('project.name LIKE :keyword OR project.description LIKE :keyword OR project.intro LIKE :keyword', { keyword: `%${keyword}%`})
    }

    if (firstPosition) {
      query.andWhere('project.firstPosition IN (:...firstPosition)', { firstPosition });
    }

    if (secondPosition) {
      query.andWhere('project.secondPosition IN (:...secondPosition)', { secondPosition });
    }

    if (contactType) {
      query.andWhere( new Brackets(qb => {
        contactType.forEach((type, index) => {
          if (index === 0) {
            qb.where('project.contactType LIKE :contactType', { contactType: `%${type}%` });
          } else {
            qb.orWhere('project.contactType LIKE :contactType', { contactType: `%${type}%` });
          }
        });
      }));
    }

    if (memberCount) {
      query.andWhere( new Brackets(qb => {
        memberCount.forEach((count, index) => {
          if (index === 0) {
            qb.where('project.memberCount = :memberCount', { memberCount: count });
          } else {
            qb.orWhere('project.memberCount = :memberCount', { memberCount: count });
          }
        });
      }));
    }

    if (recruitStartDate && recruitEndDate) {
      query.andWhere('Date(project.recruitStartDate) <= Date(:recruitEndDate) AND Date(project.recruitEndDate) >= Date(:recruitStartDate)', { recruitStartDate, recruitEndDate });
    }

    if (startDate && endDate) {
      query.andWhere('Date(project.start_date) <= Date(:endDate) AND Date(project.end_date) >= Date(:startDate)', { startDate, endDate });
    }

    if (place) {
      query.andWhere( new Brackets(qb => {
        place.forEach((place, index) => {
          if (index === 0) {
            qb.where('project.place LIKE :place', { place: `%${place}%` });
          } else {
            qb.orWhere('project.place LIKE :place', { place: `%${place}%` });
          }
        });
      }));
    }

    if (field) {
      query.andWhere( new Brackets(qb => {
        field.forEach((field, index) => {
          if (index === 0) {
            qb.where('project.field LIKE :field', { field: `%${field}%` });
          } else {
            qb.orWhere('project.field LIKE :field', { field: `%${field}%` });
          }
        });
      }));
    }

    if (platform) {
      query.andWhere( new Brackets(qb => {
        platform.forEach((platform, index) => {
          if (index === 0) {
            qb.where('project.platform LIKE :platform', { platform: `%${platform}%` });
          } else {
            qb.orWhere('project.platform LIKE :platform', { platform: `%${platform}%` });
          }
        });
      }));
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
