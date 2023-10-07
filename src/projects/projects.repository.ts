import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { CreateNewProjectRequestDto } from './dtos/requests/create-new-project-request.dto';
import { UpdateProjectRequestDto } from './dtos/requests/update-project-request.dto';

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

  async findAll() {
    this.repo.find();
  }

  async findOneProject(id: string): Promise<Project> {
    try {
      return this.repo.findOneBy({ id: id });
    } catch (error) {
      throw error;
    }
  }

  async createProject(requestDto: CreateNewProjectRequestDto) {
    return this.repo.save(requestDto);
  }

  async updateProject(id: string, requestDto: UpdateProjectRequestDto) {
    this.repo.update(id, requestDto);
  }

  async softDeleteProject(id: string) {
    this.repo.softDelete(id);
  }
}
