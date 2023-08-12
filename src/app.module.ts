import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { LoggersModule } from './commons/middlewares/loggers.module';
import * as Joi from 'joi';
import { LoggersMiddleware } from './commons/middlewares/loggers.middleware';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { RedisModule } from './redis/redis.module';

import { ProjectModule } from './projects/project.module';
import { Project } from './projects/entities/project.entity';
import { EmailModule } from './email/email.module';
import { HealthModule } from './health/health.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').required(),
        SERVER_PORT: Joi.number().default(3001).required(),
        /* DATABASE (RDBMS) */
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PWD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        /** EMAIL */
        MAILER_HOST: Joi.string(),
        MAILER_USER: Joi.string(),
        MAILER_PASSWORD: Joi.string(),
        /** JWT */
        JWT_SECRET: Joi.string(),
        JWT_EXPIRATION: Joi.string(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PWD,
      database: process.env.DB_NAME,
      entities: [User, Project],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
      charset: 'utf8mb4',
    }),
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   signOptions: {
    //     expiresIn: process.env.JWT_EXPIRATION,
    //   },
    // }),

    LoggersModule,
    AuthModule,
    UsersModule,
    RedisModule,
    ProjectModule,
    EmailModule,
    HealthModule,
    PassportModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (process.env.NODE_ENV !== 'production') {
      consumer.apply(LoggersMiddleware).forRoutes('*');

      // 회원가입, 로그인을 제외한, 나머지 API에서는 accessToken 검증이 필요하다.
    }
  }
}
