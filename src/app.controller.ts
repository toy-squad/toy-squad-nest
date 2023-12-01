import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Logger,
  Res,
  Patch,
  Put,
  Query,
} from '@nestjs/common';

import { AuthService } from 'auth/auth.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'auth/decorators/public.decorator';
import { CreateUserRequestDto } from 'users/dtos/requests/create-user-request.dto';
import { UsersService } from 'users/users.service';
import { LocalAuthGuard } from 'auth/guards/local-auth/local-auth.guard';
import RequestWithUser from 'auth/interfaces/request-with-user.interface';
import { Request, Response } from 'express';
import { KakaoGuard } from 'auth/guards/kakao/kakao.guard';
import { GoogleGuard } from 'auth/guards/google/google.guard';
import { ConfigService } from '@nestjs/config';
import { RefreshAccessTokenRequestDto } from 'auth/dtos/requests/refresh-access-token-request.dto';
import { SendEmailToNewUserEvent } from 'users/events/send-email-to-new-user.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SignInRequestBody } from 'auth/dtos/requests/sign-in-user-request.dto';
import { User } from 'users/entities/user.entity';

@ApiTags('공통 API')
@Controller()
export class AppController {
  private REFRESH_TOKEN_EXPIRATION: number;
  private FRONTEND_URL: string;
  private static NODE_ENV: string;
  private static COOKIE_SECURE_OPTION: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.REFRESH_TOKEN_EXPIRATION = this.configService.get(
      'REFRESH_TOKEN_EXPIRATION',
    );

    this.FRONTEND_URL = this.configService.get('FRONTEND_URL');
    AppController.NODE_ENV = this.configService.get('NODE_ENV') ?? 'test';

    AppController.COOKIE_SECURE_OPTION =
      AppController.NODE_ENV === 'test' ? false : true;
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
    summary: '[public] 회원가입 API',
    description:
      '[public] 일반 회원가입  포지션 카테고리는 DEVELOPER / MANAGER / DESIGNER 중 1개 선택',
  })
  @ApiBody({
    type: CreateUserRequestDto,
  })
  @ApiOkResponse({
    description: 'Success - 회원가입 환영 이메일 발송됨.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description:
      '이미 존재하는 유저입니다 - 입력 이메일이 이미 회원으로 등록된 경우',
  })
  @ApiResponse({
    status: 400,
    description: '존재하지 않은 포지션입니다 - 포지션 유효성 검사 실패',
  })
  async generateNewUser(@Body() dto: CreateUserRequestDto) {
    const newUser = await this.userService.createUser(dto);

    // 회원가입 환영 이메일을 전송이벤트 핸들러를 호출한다.
    const sendEmailToNewUserEvent: SendEmailToNewUserEvent = {
      email: newUser.email,
      name: newUser.name,
    };

    this.eventEmitter.emit('send.email.to.new.user', sendEmailToNewUserEvent);

    return newUser;
  }

  /**
   *
   * 일반: 로그인
   * URL: /api/sign-in
   */
  @Post('/sign-in')
  @ApiOperation({
    summary: '[public] 일반 로그인 API',
    description: '[public] 일반 email/password 입력하여 로그인',
  })
  @ApiBody({
    type: SignInRequestBody,
  })
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청입니다. - 이메일과 유저아이디가 존재하지 않을 때',
  })
  @ApiResponse({
    status: 401,
    description: '유저인증에 실패하였습니다 - 이메일, 비밀번호 불일치',
  })
  @Public()
  @UseGuards(LocalAuthGuard)
  async signIn(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Body() dto: SignInRequestBody,
  ) {
    const { user } = request;

    // 헤더에 Bearer Token 형태로 응답
    const tokens = await this.authService.signIn(user.userId, user.email);

    // 유저아이디를 쿠키에 저장
    response.cookie('user_id', user.userId, {
      maxAge: this.REFRESH_TOKEN_EXPIRATION,
      httpOnly: true,
      secure: AppController.COOKIE_SECURE_OPTION,
      sameSite: AppController.COOKIE_SECURE_OPTION ? 'none' : undefined,
    });
    return response.json({
      ...tokens,
      user_id: user.userId,
    });
  }

  /** 로그아웃 */
  @ApiOperation({
    summary: '로그아웃 API',
    description: '로그아웃 - 액세스토큰/리프래시토큰 모두 삭제됨',
  })
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiResponse({
    status: 401,
    description:
      '인증이 만료되었습니다 - 유저아이디, 액세스토큰 만료할때 발생합니다.',
  })
  @Get('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    const { userId } = request.user;
    await this.authService.logOut(userId);

    // 쿠키삭제
    response.cookie('user_id', null, {
      maxAge: 0,
      httpOnly: true,
      secure: AppController.COOKIE_SECURE_OPTION,
      sameSite: AppController.COOKIE_SECURE_OPTION ? 'none' : undefined,
    });
    return response.json();
  }

  /**
   * refresh 토큰으로 액세스토큰 재발급
   * - 토큰이 존재하면, key값에 대한 액세스 토큰을 재발급하여 레디스에 저장...
   */
  @ApiOperation({
    summary: '[public] 리프래시 토큰 API',
    description: '[public] 액세스 토큰 갱신',
  })
  @ApiBody({
    type: RefreshAccessTokenRequestDto,
  })
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiResponse({
    status: 400,
    description: '존재하지 않은 유저입니다 - 유저아이디가 조회되지 않을 경우',
  })
  @ApiResponse({
    status: 401,
    description:
      '인증이 만료되었습니다 - 리프래시토큰이 존재하지 않거나, 리프레시토큰과 레디스에 저장된 리프래시토큰이 일치하지 않을 때',
  })
  @Public()
  @Put('refresh')
  async refreshAccessToken(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Body() dto: RefreshAccessTokenRequestDto,
  ) {
    const tokens = await this.authService.refreshAccessToken(dto);

    response.cookie('user_id', dto.user_id, {
      maxAge: this.REFRESH_TOKEN_EXPIRATION,
      httpOnly: true,
      secure: AppController.COOKIE_SECURE_OPTION,
      sameSite: AppController.COOKIE_SECURE_OPTION ? 'none' : undefined,
    });
    return response.json({ ...tokens, user_id: dto.user_id });
  }

  /**
   * TODO
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
    summary: '카카오 연동 로그인 API - 인가코드 요청',
    description: '카카오 인증서버로 인가코드 받기 요청',
  })
  @Get('/sign-in/kakao')
  @Public()
  @UseGuards(KakaoGuard)
  async signInByKakaoOnlyBE(@Req() req: Request, @Res() res: Response) {}

  /**
   * 구글로그인 리다이렉트
   * URL: /api/oauth/kakao
   * @param code
   * @param req
   * @param res
   * @returns
   */
  @ApiOperation({
    summary: '카카오 연동 로그인 API - 인가코드로 액세스토큰 요청',
    description:
      '인가코드를 발급받은 후, 카카오 내부서버에 로그인하여 카카오 유저정보 조회 및 토이스쿼드 유저정보조회',
  })
  @Get('/oauth/kakao')
  @Public()
  @UseGuards(KakaoGuard)
  async redirectKakao(
    @Query() code: string,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    const { user } = req;
    const tokens = await this.authService.signIn(user.userId, user.email);

    // 리프래시토큰과 유저아이디를 쿠키에 저장
    res.cookie('user_id', user.userId, {
      maxAge: this.REFRESH_TOKEN_EXPIRATION,
      httpOnly: true,
      secure: AppController.COOKIE_SECURE_OPTION,
      sameSite: AppController.COOKIE_SECURE_OPTION ? 'none' : undefined,
    });

    return res.status(200).json({
      ...tokens,
      user_id: user.userId,
    });
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
  async redirectGoogle(@Req() req: RequestWithUser, @Res() res: Response) {
    const { user } = req;
    const tokens = await this.authService.signIn(user.userId, user.email);

    // 리프래시토큰과 유저아이디를 쿠키에 저장
    res.cookie('user_id', user.userId, {
      maxAge: this.REFRESH_TOKEN_EXPIRATION,
      httpOnly: true,
      secure: AppController.COOKIE_SECURE_OPTION,
      sameSite: AppController.COOKIE_SECURE_OPTION ? 'none' : undefined,
    });

    return res.status(200).json({
      ...tokens,
      user_id: user.userId,
    });
  }
}
