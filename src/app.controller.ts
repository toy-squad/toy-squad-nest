import {
  Body,
  Controller,
  Get,
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
import { GoogleGuard } from 'auth/guards/google/google.guard';
import { ConfigService } from '@nestjs/config';

@ApiTags('공통 API')
@Controller()
export class AppController {
  private REFRESH_TOKEN_EXPIRATION: number;
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {
    this.REFRESH_TOKEN_EXPIRATION = this.configService.get(
      'REFRESH_TOKEN_EXPIRATION',
    );
  }

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
  @ApiOperation({
    summary: '일반 로그인 API',
    description: '일반 email/password 입력하여 로그인',
  })
  @Post('/sign-in')
  @Public()
  @UseGuards(LocalAuthGuard)
  async signIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;

    // 헤더에 Bearer Token 형태로 응답
    const tokens = await this.authService.signIn(user.userId, user.email);
    const { access_token, refresh_token } = tokens;
    response.setHeader('Authorization', `Bearer ${access_token}`);

    // 리프래시토큰과 유저아이디를 쿠키에 저장
    const userIdCookie = `userId=${user.userId}; HttpOnly; Max-Age=${this.REFRESH_TOKEN_EXPIRATION}`;
    const refreshTokenCookie = `refreshToken=${refresh_token}; HttpOnly; Max-Age=${this.REFRESH_TOKEN_EXPIRATION}`;
    response.setHeader('Set-Cookie', [userIdCookie, refreshTokenCookie]);

    return response.json(tokens);
  }

  /** 로그아웃 */
  @ApiOperation({
    summary: '로그아웃 API',
    description: '로그아웃 - 액세스토큰/리프래시토큰 모두 삭제됨',
  })
  @Get('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    const { userId } = request.user;
    await this.authService.logOut(userId);

    // 쿠키삭제
    const userIdCookie = `userId=; HttpOnly; Max-Age=0`;
    const refreshTokenCookie = `refreshToken=; HttpOnly; Max-Age=0`;
    response.setHeader('Set-Cookie', [userIdCookie, refreshTokenCookie]);
    return response.json();
  }

  /**
   * refresh 토큰으로 액세스토큰 재발급
   * - 토큰이 존재하면, key값에 대한 액세스 토큰을 재발급하여 레디스에 저장...
   */
  @ApiOperation({
    summary: '리프래시 토큰 API',
    description: '액세스 토큰 갱신',
  })
  @Public()
  @Get('refresh')
  async refreshAccessToken(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    // 쿠키에서 리프래시토큰과 유저아이디를 얻는다.
    const { userId, refreshToken } = request.cookies;

    const tokens = await this.authService.refreshAccessToken({
      userId,
      refreshToken,
    });

    // 갱신된 리프래시토큰을 쿠키에 저장한다.
    const userIdCookie = `userId=${userId}; HttpOnly; Max-Age=${this.REFRESH_TOKEN_EXPIRATION}`;
    const refreshTokenCookie = `refreshToken=${tokens.refresh_token}; HttpOnly; Max-Age=${this.REFRESH_TOKEN_EXPIRATION}`;
    response.setHeader('Set-Cookie', [userIdCookie, refreshTokenCookie]);

    // 헤더에 갱신된 액세스 토큰으로 응답
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
   * URL: /api/sign-in/kakao
   */
  @ApiOperation({
    summary: '카카오 연동 로그인 API',
    description: '카카오 연동 로그인',
  })
  @Get('/sign-in/kakao')
  @Public()
  @UseGuards(KakaoGuard)
  async signInByKakao() {
    return;
  }

  // 카카오로그인 리다이랙트
  @ApiOperation({
    summary: '카카오 연동 로그인 리다이렉트',
    description: '카카오 연동 로그인 리다이렉트',
  })
  @Get('/oauth/kakao')
  @Public()
  @UseGuards(KakaoGuard)
  async redirectKakao(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const { user } = request;
    this.logger.log(user);

    const tokens = await this.authService.signIn(user.userId, user.email);
    const { access_token, refresh_token } = tokens;
    response.setHeader('Authorization', `Bearer ${access_token}`);

    // 리프래시토큰과 유저아이디를 쿠키에 저장
    const userIdCookie = `userId=${user.userId}; HttpOnly; Max-Age=${this.REFRESH_TOKEN_EXPIRATION}`;
    const refreshTokenCookie = `refreshToken=${refresh_token}; HttpOnly; Max-Age=${this.REFRESH_TOKEN_EXPIRATION}`;
    response.setHeader('Set-Cookie', [userIdCookie, refreshTokenCookie]);

    return response.json(tokens);
  }

  /**
   *
   * sns: gmail 연동 로그인
   * URL: /api/sign-in/google
   */
  @ApiOperation({
    summary: '구글 연동 로그인 API',
    description: '구글 연동 로그인',
  })
  @Get('/sign-in/google')
  @Public()
  @UseGuards(GoogleGuard)
  async signInByGoogle(@Req() request: RequestWithUser) {
    return;
  }

  // 구글로그인 리다이렉트
  @ApiOperation({
    summary: '구글 연동 로그인 리다이렉트',
    description: '구글 연동 로그인 리다이렉트',
  })
  @Get('oauth/google')
  @Public()
  @UseGuards(GoogleGuard)
  async redirectGoogle(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const { user } = request;
    const tokens = await this.authService.signIn(user.userId, user.email);
    const { access_token, refresh_token } = tokens;

    response.setHeader('Authorization', `Bearer ${access_token}`);

    // 리프래시토큰과 유저아이디를 쿠키에 저장
    const userIdCookie = `userId=${user.userId}; HttpOnly; Max-Age=${this.REFRESH_TOKEN_EXPIRATION}`;
    const refreshTokenCookie = `refreshToken=${refresh_token}; HttpOnly; Max-Age=${this.REFRESH_TOKEN_EXPIRATION}`;
    response.setHeader('Set-Cookie', [userIdCookie, refreshTokenCookie]);

    return response.json(tokens);
  }
}
