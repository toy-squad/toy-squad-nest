import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from 'entities/user.entity';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import getRandomPosition from 'commons/utils/seeding-position.util';

export default class UserSeeds implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    // 유저데이터 10개 생성
    const userRepository = dataSource.getRepository(User);

    await userRepository.insert({
      email: 'seed-test@yopmail.com',
      name: 'seed-data-test',
      password: bcrypt.hashSync('1234', 10),
      position: getRandomPosition(),
    });
    // const userFactory = factoryManager.get(User);
    // await userFactory.saveMany(10);

    // 프로젝트 데이터 10개 생성

    // 코멘트 데이터 10개 생성
  }
}
