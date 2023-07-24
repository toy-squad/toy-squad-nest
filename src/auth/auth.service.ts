import { Injectable } from '@nestjs/common';
import { EmailService } from 'email/email.service';
import { UsersService } from 'users/users.service';
import { ConfirmPasswordRequestDto } from 'users/dtos/requests/confirm-password-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(dto: ConfirmPasswordRequestDto) {
    try {
      // 검증된 유저인지 확인 결과값
      let isVerifyUser: boolean | Promise<boolean> = true;

      // 비밀번호 검증
      isVerifyUser = await this.userService.confirmPassword(dto);

      //  이메일 2차인증 추가예정
      return isVerifyUser;
    } catch (error) {
      throw error;
    }
  }

  async login(dto: ConfirmPasswordRequestDto) {
    try {
    } catch (error) {
      throw error;
    }
  }
}
