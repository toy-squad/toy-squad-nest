import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from 'auth/auth.service';
import { EmailService } from 'email/email.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignInRequestDto } from 'auth/dtos/requests/sign-in-user-request.dto';
import { Public } from 'auth/decorators/public.decorator';
import { CreateUserRequestDto } from 'users/dtos/requests/create-user-request.dto';
import { UsersService } from 'users/users.service';
import { LocalAuthGuard } from 'auth/guards/local-auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * 회원가입 API
   * URL: /api/join
   */
  @Post('join')
  @ApiOperation({
    summary: '회원가입 API',
    description: '일반 회원가입',
  })
  async generateNewUser(@Body() dto: CreateUserRequestDto) {
    const newUser = await this.userService.createUser(dto);
    return newUser;
  }

  /**
   *
   * 일반: 로그인
   * URL: /api/sign-in
   */
  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async signIn(@Request() req) {
    await this.authService.signIn(req.user);
  }

  /** 로그아웃 */

  /**
   *
   * sns: 카카오 연동 로그인
   * URL: /api/kakao
   */
  @Post('kakao')
  async signInByKakao() {}
  /**
   *
   * sns: gmail 연동 로그인
   * URL: /api/google
   */
  @Post('google')
  async signInByGoogle() {}

  /**
   * 이메일 인증
   */
}
