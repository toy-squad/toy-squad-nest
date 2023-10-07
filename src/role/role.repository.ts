import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(Role) private readonly repo: Repository<Role>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async createGenerateRole(requestDto: CreateRoleDto) {
    try {
      await this.repo.save(requestDto);
    } catch (error) {
      throw error;
    }
  }
}
