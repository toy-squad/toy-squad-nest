import { Controller, Post } from '@nestjs/common';
import { EmailService } from 'email/email.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly emailService: EmailService,
    private readonly authService: AuthService,
  ) {}
  /**
   *
   * 일반: 로그인
   */
  
  /**
   *
   * 공통: 로그아웃
   */
  /**
   *
   * sns: 카카오 연동 로그인
   */
  /**
   *
   * sns: gmail 연동 로그인
   */

  /**
   * 이메일 인증
   */
}
