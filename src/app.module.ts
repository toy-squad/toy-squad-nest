import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import * as Joi from 'joi';
import { LoggersMiddleware } from './commons/middlewares/loggers.middleware';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from './projects/project.module';
import { EmailModule } from './email/email.module';
import { HealthModule } from './health/health.module';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from 'redis/redis.module';
import { RoleModule } from './role/role.module';
import { AccessControlAllowOriginMiddleware } from 'commons/middlewares/access-control-allow-origin.middleware';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SendEmailToNewUserListener } from 'users/listeners/send-email-to-new-user.listener';

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
    EventEmitterModule.forRoot(),
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
  providers: [SendEmailToNewUserListener],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (process.env.NODE_ENV !== 'production') {
      consumer.apply(LoggersMiddleware).forRoutes('*');

      // 응답헤더에 access-control-allow-origin을 부여한다.
      consumer.apply(AccessControlAllowOriginMiddleware).forRoutes('*');
    }
  }
}
