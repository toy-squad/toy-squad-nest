import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Likes } from './entities/likes.entity';
import { DataSource, Repository } from 'typeorm';
import {
  CancelLikesHistoryDto,
  FindGaveLikesHistoryDto,
  FindOneLikesHistoryDto,
  InsertLikesHistoryDto,
  findReceivedLikesHistoryDto,
} from './dto/request-dtos';
import {
  FindGaveLikesHistoryResponseDto,
  FindReceivedLikesHistoryResponseDto,
} from './dto/response-dto';

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
    const { from, to } = dto;
    try {
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Likes)
        .values({
          from: from,
          to: to,
        })
        .execute();
    } catch (error) {
      return error;
    }
  }

  async cancelLikesHistory(dto: CancelLikesHistoryDto) {
    const { from, to } = dto;
    try {
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

  async findGaveLikesHistory(
    dto: FindGaveLikesHistoryDto,
  ): Promise<FindGaveLikesHistoryResponseDto> {
    const { targetUserId } = dto;
    try {
      // targetUserId가 누른 좋아요 히스토리 조회 (from: targetUserId)
      const givenHistories = await this.dataSource
        .getRepository(Likes)
        .createQueryBuilder('likes')
        .where('likes.from = :from', { from: targetUserId })
        .getMany();

      const responseDto: FindGaveLikesHistoryResponseDto = {
        likeHistories: givenHistories,
        likes: givenHistories.length ?? 0,
      };

      return responseDto;
    } catch (error) {
      return error;
    }
  }

  async findReceivedLikesHistory(
    dto: findReceivedLikesHistoryDto,
  ): Promise<FindReceivedLikesHistoryResponseDto> {
    const { targetUserId } = dto;
    try {
      // targetUserId가  받은 좋아요 히스토리 조회 (to: targetUserId)
      const receivedHistories = await this.dataSource
        .getRepository(Likes)
        .createQueryBuilder('likes')
        .where('likes.to = :to', { to: targetUserId })
        .getMany();

      const responseDto: FindReceivedLikesHistoryResponseDto = {
        likeHistories: receivedHistories,
        likes: receivedHistories.length ?? 0,
      };

      return responseDto;
    } catch (error) {
      return error;
    }
  }
}
