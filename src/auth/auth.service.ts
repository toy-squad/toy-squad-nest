import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EmailService } from 'email/email.service';
import { UsersService } from 'users/users.service';
import { ValidateUserRequestDto } from './dtos/requests/validate-user-request.dto';
import { ConfirmPasswordRequestDto } from 'users/dtos/requests/confirm-password-request.dto';
import { PublicUserInfo } from 'users/types/public-user-info.type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * auth-guard 데코레이션을 만나면 유저 체킹
   */
  async validateUser(dto: ValidateUserRequestDto) {
    try {
      // 비밀번호 검증
      const isPasswordMatched = await this.userService.confirmPassword({
        email: dto.email,
        plainTextPassword: dto.password,
      });

      if (!isPasswordMatched) {
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
      }

      // Todo: 이메일 2차인증 추가예정

      // 비밀번호를 제외한 유저정보를 조회
      const publicUserInfo: PublicUserInfo = await this.userService.findOneUser(
        { email: dto.email },
      );
      return publicUserInfo;
    } catch (error) {
      throw error;
    }
  }

  async signIn(dto: ValidateUserRequestDto) {
    try {
      // 저장완료되면 쿠키에 저장.
    } catch (error) {
      throw error;
    }
  }
}
