import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MysqlModule } from './mysql/typeorm.module';
import { LoggersModule } from './commons/loggers/loggers.module';
import * as Joi from 'joi';
import { LoggersMiddleware } from './commons/loggers/loggers.middleware';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').required(),
        SERVER_PORT: Joi.number().default(3000).required(),
        /* DATABASE (RDBMS) */
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PWD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PWD,
      database: process.env.DB_NAME,
      entities: [User],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
      charset: 'utf8mb4',
    }),
    MysqlModule,
    LoggersModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (process.env.NODE_ENV !== 'production') {
      consumer.apply(LoggersMiddleware).forRoutes('*');
    }
  }
}
