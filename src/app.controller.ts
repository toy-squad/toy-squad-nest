import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Req,
  Logger,
  Res,
} from '@nestjs/common';

import { AuthService } from 'auth/auth.service';
import { EmailService } from 'email/email.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignInRequestDto } from 'auth/dtos/requests/sign-in-user-request.dto';
import { Public } from 'auth/decorators/public.decorator';
import { CreateUserRequestDto } from 'users/dtos/requests/create-user-request.dto';
import { UsersService } from 'users/users.service';
import { LocalAuthGuard } from 'auth/guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from 'auth/guards/jwt-auth/jwt-auth.guard';
import RequestWithUser from 'auth/interfaces/request-with-user.interface';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}
  private readonly logger = new Logger(AppController.name);
  @Get()
  getHello(): string {
    // return this.appService.getHello();
    return 'hello';
  }

  /**
   * 회원가입 API
   * URL: /api/join
   */

  @Post('/join')
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
  @Post('/sign-in')
  @UseGuards(LocalAuthGuard)
  async signIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;

    // 1. JWT 토큰을 쿠키에 저장.
    // const cookie = this.authService.getCookieWithJwtToken(user.id, user.email);
    // response.setHeader('Set-Cookie', cookie);
    // return response.send(user);

    // 2. 헤더에 Bearer Token 형태로 응답
    const access_token = await this.authService.signIn(user.id, user.email);
    response.setHeader('Authorization', `Bearer ${access_token}`);
    return response.json(access_token);
  }

  /** 로그아웃 */

  /**
   *
   * sns: 카카오 연동 로그인
   * URL: /api/kakao
   */
  @Post('/kakao')
  async signInByKakao() {}
  /**
   *
   * sns: gmail 연동 로그인
   * URL: /api/google
   */
  @Post('/google')
  async signInByGoogle() {}

  /**
   * 이메일 인증
   */
}
