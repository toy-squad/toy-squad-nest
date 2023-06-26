import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { FindUserRequestDto } from './dtos/find-user-request.dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async createNewUser(dto: CreateUserRequestDto) {
    try {
      const { positionCategory, ...newUser } = dto;
      return await this.repo.save(newUser);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async findUser(dto: FindUserRequestDto) {
    try {
      const { email, userId } = dto;
      if (!email || !userId) {
        throw new BadRequestException(
          '회원 조회를 위한 조건이 존재하지 않습니다.',
        );
      }
      const user = await this.repo.find({
        where: {
          id: userId,
          email: email,
        },
      });

      return user;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
