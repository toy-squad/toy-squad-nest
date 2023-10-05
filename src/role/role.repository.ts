import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(Role) private readonly repo: Repository<Role>,
    @InjectDataSource() private rawQueryDataSource: DataSource,
  ) {}
}
