import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteDateColumn, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserRequestDto } from './dtos/requests/create-user-request.dto';
import { FindUserRequestDto } from './dtos/requests/find-one-user-request.dto';
import { FindUserListRequestDto } from './dtos/requests/find-user-list-request.dto';
import { RealUserInfoType } from './types/real-user-info.type';
import { UpdateUserInfoRequestDto } from './dtos/requests/update-user-info-request.dto';
// import { FindUserListResponseDto } from './dtos/responses/find-user-list-response.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async createNewUser(dto: any) {
    try {
      const { positionCategory, ...userInfo } = dto;
      return await this.repo.save(userInfo);
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
      const _userList = await this.dataSource
        .getRepository(User)
        .createQueryBuilder('u')
        .take(take) // LIMIT
        .skip(take * (page - 1))
        .getMany();

      const userList: RealUserInfoType = _userList.map((userInfo) => {
        const {
          password,
          kakaoAuthId,
          googleAuthId,
          createdAt,
          deletedAt,
          ...realInfo
        } = userInfo;
        return realInfo;
      });

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

  async updateUserInfo(dto: UpdateUserInfoRequestDto) {
    try {
      const { userId, ...updatedUserInfo } = dto;
      await this.dataSource
        .getRepository(Users)
        .createQueryBuilder()
        .update(Users)
        .set(updatedUserInfo)
        .where('id = :id', { id: userId })
        .execute();
    } catch (error) {
      throw error;
    }
  }
}
