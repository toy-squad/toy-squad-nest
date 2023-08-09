import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailModule } from 'email/email.module';
import { UsersModule } from 'users/users.module';
import { AuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    EmailModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
  ],
  providers: [
    {
      /**
       * authController에 정의되어있는 API들은
       * 컨트롤러 내부에 진입하기전에,  AuthGuard에서 유저인증절차를 밟는다.
       */
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
