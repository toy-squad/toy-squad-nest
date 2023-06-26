import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { FindUserRequestDto } from './dtos/find-one-user-request.dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async createNewUser(dto: CreateUserRequestDto) {
    try {
      const { positionCategory, ...newUser } = dto;
      return await this.repo.save(newUser);
    } catch (err) {
      throw err;
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
    } catch (err) {
      throw err;
    }
  }

  async findUserList(dto: FindUserRequestDto) {
    try {
      const user = await this.repo.find({
        where: { ...dto },
      });

      return user;
    } catch (err) {
      throw err;
    }
  }
}
