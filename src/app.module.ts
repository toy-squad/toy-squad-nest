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
import { ProjectModule } from './projects/project.module';
import { Project } from './projects/entities/project.entity';
import { EmailModule } from './email/email.module';
import { HealthModule } from './health/health.module';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from 'redis/redis.module';
import { RoleController } from './role/role.controller';
import { RoleModule } from './role/role.module';
import { Role } from 'role/entities/role.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.production.env'
          : process.env.NODE_ENV === 'development'
          ? '.development.env'
          : '.test.env',
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('production', 'development', 'test')
          .required(),
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
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
        ACCESS_TOKEN_EXPIRATION: Joi.number().required(),
        /** REFRESH TOKEN */
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRATION: Joi.string().required(),
        REFRESH_TOKEN_EXPIRATION: Joi.number().required(),
        /** KAKAO OAUTH */
        KAKAO_CLIENT_ID: Joi.string().required(),
        KAKAO_SECRET_KEY: Joi.string().required(),
        KAKAO_CALLBACK_URL: Joi.string().required(),
        /** GOOGLE OAUTH */
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_CALLBACK_URL: Joi.string().required(),
        /** REDIS */
        REDIS_URL: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string().required(),
        /** SERVER URL */
        SERVER_URL: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
        /** RESET_PASSWORD */
        RESET_PASSWORD_TOKEN_EXPIRATION: Joi.number().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PWD,
      database: process.env.DB_NAME,
      entities: [],
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
      charset: 'utf8mb4',
    }),
    LoggersModule,
    AuthModule,
    UsersModule,
    ProjectModule,
    EmailModule,
    HealthModule,
    PassportModule,
    RedisModule,
    RoleModule,
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
