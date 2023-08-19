import {
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

@Injectable()
export class AuthService {
  private TOKEN_EXPIRATION: number;
  constructor(
    private readonly userService: UsersService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.TOKEN_EXPIRATION = +this.configService.get('ACCESS_TOKEN_EXPIRATION');
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

      // 액세스토큰을 생성한다
      const accessToken = this.jwtService.sign(payload);

      // 생성된 액세스토큰을 레디스에 저장한다
      // 키: 유저아이디
      // 값: 액세스토큰
      // 유효기간: 토큰 유효기간(.env에 정의된 값)
      await this.cacheManager.set(userId, accessToken, this.TOKEN_EXPIRATION);

      //JWT토큰을 리턴
      return {
        access_token: accessToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async logOut(userId: string) {
    try {
      // userId가 undefined가 아닌 유효한값인지 확인한다.
      // 캐시에 userId인 키가 있는지 확인한다.
      const accessToken = await this.cacheManager.get(userId);
      const isUnvalidUser = !userId || !accessToken;
      if (isUnvalidUser) {
        throw new UnauthorizedException('유효하지 않은 회원입니다.');
      }

      // 캐시히트가 된다면, 레디스에 있는 값을 지운다.
      await this.cacheManager.del(userId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * [사용안함!]
   * 쿠키에 JWT토큰을 담는다
   */
  public getCookieWithJwtToken(userId: string, email: string) {
    const payload: TokenPayload = { userId: userId, email: email };
    const token = this.jwtService.sign(payload);
    return `access_token=${token}; HttpOnly; Path=/; Max-Age=${this.TOKEN_EXPIRATION}`;
  }
}
