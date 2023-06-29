import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { DataSource, DeleteDateColumn, Repository } from 'typeorm';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { FindUserRequestDto } from './dtos/find-one-user-request.dto';
import { FindUserListRequestDto } from './dtos/find-user-list-request.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users) private readonly repo: Repository<Users>,
    private readonly dataSource: DataSource,
  ) {}

  async createNewUser(dto: CreateUserRequestDto) {
    try {
      const { positionCategory, ...newUser } = dto;
      return await this.repo.save(newUser);
    } catch (error) {
      throw error;
    }
  }

  async findOneUser(dto: FindUserRequestDto) {
    try {
      const userId = dto.userId ?? undefined;
      const email = dto.email ?? undefined;
      const phone = dto.phone ?? undefined;

      const user = await this.repo.findOne({
        where: {
          id: userId,
          email: email,
          phone: phone,
        },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async findUserList(dto: FindUserListRequestDto) {
    const { page, take } = dto;
    try {
      // Todo : FindUserListResponseDto 리스폰스받는 컬럼들 정의할것
      const userList = await this.dataSource
        .getRepository(Users)
        .createQueryBuilder('u')
        .take(take) // LIMIT
        .skip(take * (page - 1))
        .getMany();

      return userList;
    } catch (error) {
      throw error;
    }
  }

  async softDeleteUser(userId: string): Promise<void> {
    try {
      await this.repo.softDelete(userId);
    } catch (error) {
      throw error;
    }
  }
}
