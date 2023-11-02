import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(Role) private readonly repo: Repository<Role>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async createRole(dto: CreateRoleDto) {
    await this.repo.save(dto);
  }

  async findOneRole(dto: UpdateRoleDto) {
    const result = await this.repo.find({
      relations: ['project', 'user'],
    });
    return result[0].role;
  }
}
