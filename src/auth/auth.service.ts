import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EmailService } from 'email/email.service';
import { UsersService } from 'users/users.service';
import { ValidateUserRequestDto } from './dtos/requests/validate-user-request.dto';
import { ConfirmPasswordRequestDto } from 'users/dtos/requests/confirm-password-request.dto';
import { PublicUserInfo } from 'users/types/public-user-info.type';
import { JwtService } from '@nestjs/jwt';
import { SignInRequestDto } from './dtos/requests/sign-in-user-request.dto';
import { Payload } from './interfaces/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
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
  async signIn(payload: PublicUserInfo) {
    try {
      // Payload
      // JWT Payload 에는 토큰에 담을 정보가 들어있다.
      //JWT토큰을 생성
      return {
        access_token: this.jwtService.sign(payload),
      };

      // JSON payload에
    } catch (error) {
      throw error;
    }
  }
}
