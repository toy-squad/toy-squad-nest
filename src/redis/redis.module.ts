import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
  imports: [],
  providers: [RedisService],
  exports: [],
})
export class RedisModule {}
