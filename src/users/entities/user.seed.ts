import { Injectable } from '@nestjs/common';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { User } from 'users/entities/user.entity';
import { UsersRepository } from 'users/users.repository';

@Injectable()
export class UserSeeder implements Seeder {
  constructor(private readonly userRepository: UsersRepository) {}

  async seed(): Promise<any> {
    // 유저데이터 10개 생성
    const users = DataFactory.createForClass(User).generate(10);
    for (const user of users) {
      await this.userRepository.insert(users);
    }
    return;
  }
  async drop(): Promise<any> {}
}
