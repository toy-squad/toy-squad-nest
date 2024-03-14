import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersRepository } from './users.repository';
import { AuthModule } from 'auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AwsModule } from 'aws/aws.module';
import { RedisModule } from 'redis/redis.module';
import { LikesModule } from 'likes/likes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    ConfigModule,
    AwsModule,
    RedisModule,
    LikesModule,
  ],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
