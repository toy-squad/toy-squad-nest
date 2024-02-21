import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Likes } from './entities/likes.entity';
import { DataSource, Repository } from 'typeorm';
import {
  CancelLikesHistoryDto,
  FindOneLikesHistoryDto,
  InsertLikesHistoryDto,
} from './dto/request-dtos';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectRepository(Likes) private readonly repo: Repository<Likes>,
    private readonly dataSource: DataSource,
  ) {}

  async findOneLikesHistory(dto: FindOneLikesHistoryDto) {
    try {
      const { from, to } = dto;
      const history = await this.repo.findOne({
        where: {
          from: from,
          to: to,
        },
      });

      return history;
    } catch (error) {
      return error;
    }
  }

  async addLikesHistory(dto: InsertLikesHistoryDto) {
    try {
      const { from, to } = dto;
      await this.dataSource.createQueryRunner().manager.query(`
          INSERT INTO likes (from, to)
          VALUE('${from}', '${to}');
        `);
    } catch (error) {
      return error;
    }
  }

  async cancelLikesHistory(dto: CancelLikesHistoryDto) {
    try {
      const { from, to } = dto;
      await this.dataSource
        .getRepository(Likes)
        .createQueryBuilder('likes')
        .softDelete()
        .where('from = :from', { from: from })
        .andWhere('to = :to', { to: to })
        .execute();
    } catch (error) {
      return error;
    }
  }
}
