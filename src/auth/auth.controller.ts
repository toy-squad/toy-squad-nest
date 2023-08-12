import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { EmailService } from 'email/email.service';
import { AuthService } from './auth.service';
import { ValidateUserRequestDto } from './dtos/requests/validate-user-request.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('회원 인증 API')
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
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() dto: ValidateUserRequestDto) {
    await this.authService.signIn(dto);
  }

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
