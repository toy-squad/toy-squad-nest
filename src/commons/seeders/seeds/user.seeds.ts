import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from 'entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export default class UserSeeds implements Seeder {
  private readonly dataSource: DataSource;
  private readonly userRepository;
  private readonly factoryManager: SeederFactoryManager;
  constructor() {
    this.userRepository = this.dataSource.getRepository(User);
  }

  public async run(): Promise<any> {
    // 유저데이터 10개 생성
    const userFactory = await this.factoryManager.get(User);
    // 프로젝트 데이터 10개 생성

    // 코멘트 데이터 10개 생성
  }
}
