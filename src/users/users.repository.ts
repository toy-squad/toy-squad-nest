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
import { PublicUserInfo } from './types/public-user-info.type';
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
      const { allowPassword, userId, email, phone } = dto;

      // password 옵션이 false라면, 비밀번호 제외하여 리턴한다.
      const selectQuery = allowPassword
        ? undefined
        : {
            id: true,
            email: true,
            name: true,
            phone: true,
            imgUrl: true,
            fields: true,
            tendency: true,
            position: true,
            intro: true,
            skills: true,
            likes: true,
            kakao_auth_id: true,
            google_auth_id: true,
          };
      const user = await this.repo.findOne({
        select: selectQuery,
        where: {
          id: userId ?? undefined,
          email: email ?? undefined,
          phone: phone ?? undefined,
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
        .select('u.id')
        .addSelect('u.email')
        .addSelect('u.name')
        .addSelect('u.phone')
        .addSelect('u.imgUrl')
        .addSelect('u.fields')
        .addSelect('u.tendency')
        .addSelect('u.position')
        .addSelect('u.intro')
        .addSelect('u.skills')
        .addSelect('u.likes')
        .take(take) // LIMIT
        .skip(take * (page - 1))
        .getMany();

      const userList: PublicUserInfo[] = _userList;

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
        .getRepository(User)
        .createQueryBuilder()
        .update(User)
        .set(updatedUserInfo)
        .where('id = :id', { id: userId })
        .execute();
    } catch (error) {
      throw error;
    }
  }
}
