import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { EmailService } from 'email/email.service';
import { UsersService } from 'users/users.service';
import { ValidateUserRequestDto } from './dtos/requests/validate-user-request.dto';
import { ConfirmPasswordRequestDto } from 'users/dtos/requests/confirm-password-request.dto';
import { PublicUserInfo } from 'users/types/public-user-info.type';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import TokenPayload from './interfaces/token-payload.interface';
import { RedisService } from 'redis/redis.service';

@Injectable()
export class AuthService {
  private ACCESS_TOKEN_EXPIRATION: number;
  private REFRESH_TOKEN_EXPIRATION: number;
  constructor(
    private redisService: RedisService,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly emailService: EmailService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.ACCESS_TOKEN_EXPIRATION = this.configService.get(
      'ACCESS_TOKEN_EXPIRATION',
    );
    this.REFRESH_TOKEN_EXPIRATION = this.configService.get(
      'REFRESH_TOKEN_EXPIRATION',
    );
  }

  // 유저 검증
  // Todo: 이메일 2차인증 추가예정
  async validateUser(dto: ValidateUserRequestDto) {
    try {
      // 비밀번호 검증
      await this.userService.confirmPassword({
        email: dto.email,
        plainTextPassword: dto.password,
      });

      // 비밀번호를 제외한 유저정보를 조회
      const publicUserInfo: PublicUserInfo = await this.userService.findOneUser(
        { email: dto.email },
      );

      return publicUserInfo;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * JWT 토큰 생성
   * @param payload : payload는 토큰에 담을 정보. 유저귀중정보를 제외한 나머지
   */
  @UseInterceptors(CacheInterceptor)
  async signIn(userId: string, email: string) {
    try {
      // Payload:  JWT Payload 에는 토큰에 담을 정보가 들어있다.
      const payload: TokenPayload = { userId: userId, email: email };
      if (!userId || !email) {
        throw new BadRequestException('잘못된 요청입니다.');
      }

      const accessToken = await this.generateAccessToken(payload);
      const refreshToken = await this.generateRefreshToken(payload);

      //JWT토큰과 리프패시 토큰을 리턴
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async logOut(userId: string) {
    try {
      // userId가 undefined가 아닌 유효한값인지 확인한다.
      // 캐시에 userId인 키가 있는지 확인한다.
      const accessToken = await this.redisService.get(`access-${userId}`);
      const isUnvalidUser = !userId || !accessToken;
      if (isUnvalidUser) {
        throw new UnauthorizedException('인증이 만료되었습니다.');
      }

      // 캐시히트가 된다면, 레디스에 있는 accessToken/refreshToken을 지운다.
      await this.redisService.del(`access-${userId}`);
      await this.redisService.del(`refresh-${userId}`);
    } catch (error) {
      throw error;
    }
  }

  async refreshAccessToken(payload: TokenPayload) {
    try {
      const { userId } = payload;

      // 리프래시토큰이 있는지 확인한다
      const refreshToken = await this.redisService.get(`refresh-${userId}`);
      if (!refreshToken) {
        throw new UnauthorizedException('인증이 만료되었습니다.');
      }

      // 액세스토큰을  갱신한다
      const newAccessToken = await this.generateAccessToken(payload);

      return {
        access_token: newAccessToken,
      };
    } catch (error) {
      throw error;
    }
  }

  private async generateAccessToken(payload: TokenPayload) {
    const { userId } = payload;

    // 액세스토큰을 생성한다
    const accessToken = this.jwtService.sign(payload);

    /* 생성된 액세스토큰을 캐시에 저장한다
     * 키: 유저아이디
     * 값: 액세스토큰
     * 유효기간: 토큰 유효기간(.env에 정의된 값)
     */
    await this.redisService.set(
      `access-${userId}`,
      accessToken,
      this.ACCESS_TOKEN_EXPIRATION,
    );

    return accessToken;
  }

  private async generateRefreshToken(payload: TokenPayload) {
    const { userId } = payload;

    // 리프래시토큰을 생성한다
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
    });

    // 캐시에 저장
    await this.redisService.set(
      `refresh-${userId}`,
      refreshToken,
      this.REFRESH_TOKEN_EXPIRATION,
    );
    return refreshToken;
  }

  /**
   * [사용안함!]
   * 쿠키에 JWT토큰을 담는다
   */
  public getCookieWithJwtToken(userId: string, email: string) {
    const payload: TokenPayload = { userId: userId, email: email };
    const token = this.jwtService.sign(payload);
    return `access_token=${token}; HttpOnly; Path=/; Max-Age=${this.ACCESS_TOKEN_EXPIRATION}`;
  }
}
