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
import { Public } from 'auth/decorators/public.decorator';
import { CreateUserRequestDto } from 'users/dtos/requests/create-user-request.dto';
import { UsersService } from 'users/users.service';
import { LocalAuthGuard } from 'auth/guards/local-auth/local-auth.guard';
import RequestWithUser from 'auth/interfaces/request-with-user.interface';
import { Response } from 'express';
import TokenPayload from 'auth/interfaces/token-payload.interface';
import { KakaoGuard } from 'auth/guards/kakao/kakao.guard';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}
  private readonly logger = new Logger(AppController.name);
  @Public()
  @Get()
  getHello(): string {
    return 'hello';
  }

  /**
   * 회원가입 API
   * URL: /api/join
   */
  @Public()
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
  @Public()
  @UseGuards(LocalAuthGuard)
  async signIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;

    // 1. JWT 토큰을 쿠키에 저장.
    // const cookie = this.authService.getCookieWithJwtToken(user.id, user.email);
    // response.setHeader('Set-Cookie', cookie);
    // return response.send(user);

    // 2. 헤더에 Bearer Token 형태로 응답
    const tokens = await this.authService.signIn(user.userId, user.email);
    const { access_token } = tokens;
    response.setHeader('Authorization', `Bearer ${access_token}`);

    return response.json(tokens);
  }

  /** 로그아웃 */
  @Get('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    const { userId } = request.user;

    await this.authService.logOut(userId);
    return response.json();
  }

  /**
   * refresh 토큰으로 액세스토큰 재발급
   * - 토큰이 존재하면, key값에 대한 액세스 토큰을 재발급하여 레디스에 저장...
   */
  @Get('refresh')
  async refreshAccessToken(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const { userId, email } = request.user;
    const payload: TokenPayload = { userId: userId, email: email };
    const tokens = await this.authService.refreshAccessToken(payload);

    // 헤더에 업데이트된 토큰으로 응답
    response.setHeader('Authorization', `Bearer ${tokens.access_token}`);
    return response.json(tokens);
  }

  /**
   * 마이페이지
   * URL: /api/mypage
   *
   * - 내가 작성한 댓글 & 답글
   * - 내가 참여한 프로젝트
   * - 내가 완료한 프로젝트
   * - 내가 받은 프로젝트 제안
   * - 내가 생성한 프로젝트
   * - 내가 작성한 전시물
   *
   */
  @Get('/mypage')
  @ApiOperation({
    summary: '마이페이지 API',
    description: '로그인 유저 마이페이지',
  })
  async getMyPage(@Req() request: RequestWithUser) {
    return request.user;
  }

  /**
   *
   * sns: 카카오 연동 로그인
   * URL: /api/kakao
   */
  @Public()
  @Post('/kakao')
  @UseGuards(KakaoGuard)
  async signInByKakao() {
    return; // 리다이렉션
  }

  // 카카오로그인 리다이랙트
  @Get('/oauth/kakao')
  async redirectKakao() {}

  /**
   *
   * sns: gmail 연동 로그인
   * URL: /api/google
   */
  @Public()
  @Post('/google')
  async signInByGoogle() {}

  // 구글로그인 리다이렉트
  @Get('oauth/google')
  async redirectGoogle() {}

  /**
   * 이메일 인증
   */
}
