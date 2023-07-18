import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailModule } from 'email/email.module';

@Module({
  imports: [EmailModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
