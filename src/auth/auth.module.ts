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
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
