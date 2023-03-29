import { Module } from '@nestjs/common';
import { MysqlService } from './mysql.service';

@Module({
  providers: [MysqlService]
})
export class MysqlModule {}
