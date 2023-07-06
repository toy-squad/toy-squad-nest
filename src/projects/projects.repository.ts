import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';

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

  async findOne(id: string) {
    this.repo.findOneBy({ id: id });
  }
}
