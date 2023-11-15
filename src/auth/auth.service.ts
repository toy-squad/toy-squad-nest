import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UseInterceptors,
  forwardRef,
} from '@nestjs/common';
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
import { RefreshAccessTokenRequestDto } from './dtos/requests/refresh-access-token-request.dto';
import { GenerateResetPasswordTokenRequestDto } from './dtos/requests/generate-reset-password-token-request.dto';
import * as bcrypt from 'bcrypt';
import { CheckResetPasswordTokenRequestDto } from './dtos/requests/check-reset-password-token-request.dto';

@Injectable()
export class AuthService {
  private ACCESS_TOKEN_EXPIRATION: number;
  private REFRESH_TOKEN_EXPIRATION: number;
  private RESET_PASSWORD_TOKEN_EXPIRATION: number;

  constructor(
    private redisService: RedisService,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,

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
    this.RESET_PASSWORD_TOKEN_EXPIRATION = this.configService.get(
      'RESET_PASSWORD_TOKEN_EXPIRATION',
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

  async refreshAccessToken(dto: RefreshAccessTokenRequestDto) {
    try {
      const { userId, refreshToken } = dto;

      if (!userId) {
        throw new UnauthorizedException('인증이 만료되었습니다.');
      }

      // 레디스에 저장된 리프래시토큰을 찾는다.
      const refreshTokenRedis = await this.redisService.get(
        `refresh-${userId}`,
      );

      const user = await this.userService.findOneUser({ userId: userId });
      if (!user && !refreshTokenRedis) {
        throw new NotFoundException('존재하지 않은 유저입니다.');
      }

      // 액세스토큰을  갱신한다
      const newAccessToken = await this.generateAccessToken({
        userId: user.id,
        email: user.email,
      });

      // 리프래시토큰을 갱신한다
      const newRefreshToken = await this.generateRefreshToken({
        userId: user.id,
        email: user.email,
      });

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
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

  // 비밀번호 재설정 토큰 생성
  async generateResetPasswordToken(dto: GenerateResetPasswordTokenRequestDto) {
    try {
      const resetPasswordToken = new Date().getTime().toString();
      await this.redisService.set(
        `reset-pwd-${dto.userId}`, // key
        resetPasswordToken, // value
        this.RESET_PASSWORD_TOKEN_EXPIRATION, // ttl
      );
      return resetPasswordToken;
    } catch (error) {
      throw error;
    }
  }

  async checkResetPasswordToken(dto: CheckResetPasswordTokenRequestDto) {
    try {
      // 레디스에서 토큰을 갖고온다
      const resetPasswordTokenFromRedis = await this.redisService.get(
        `reset-pwd-${dto.userId}`,
      );

      if (!resetPasswordTokenFromRedis) {
        throw new UnauthorizedException(
          '비밀번호 재설정 토큰이 만료되었습니다.',
        );
      }

      // 비밀번호 재설정 토큰 만료 유무확인
      const isMatched = resetPasswordTokenFromRedis === dto.resetPasswordToken;

      if (isMatched === false) {
        throw new UnauthorizedException(
          '비밀번호 재설정 토큰이 만료되었습니다.',
        );
      }

      return isMatched;
    } catch (error) {
      throw error;
    }
  }
}
