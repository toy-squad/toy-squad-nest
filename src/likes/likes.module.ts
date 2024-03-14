import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Likes } from '../entities/likes.entity';
import { ConfigModule } from '@nestjs/config';
import { LikesRepository } from './likes.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Likes]), ConfigModule],
  providers: [LikesRepository],
  exports: [LikesRepository],
})
export class LikesModule {}
