import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EmailService } from 'email/email.service';
import { UsersService } from 'users/users.service';
import { ValidateUserRequestDto } from './dtos/requests/validate-user-request.dto';
import { ConfirmPasswordRequestDto } from 'users/dtos/requests/confirm-password-request.dto';
import { PublicUserInfo } from 'users/types/public-user-info.type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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
  async signIn(userId: string, email: string) {
    try {
      // Payload:  JWT Payload 에는 토큰에 담을 정보가 들어있다.
      const payload: TokenPayload = { userId: userId, email: email };

      //JWT토큰을 리턴
      return {
        access_token: this.jwtService.sign(payload),
      };
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
    return `access_token=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION',
    )}`;
  }
}
