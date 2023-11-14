import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'auth/auth.service';
import { UsersService } from 'users/users.service';

@Injectable()
export class ResetPasswordGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { token, email } = request.query;
    try {
      if (!token && !email) {
        console.error('잘못된 요청입니다. 다시 비밀번호 재설정을 해주세요.');
        return false;
      }

      const user = await this.userService.findOneUser({
        allowPassword: false,
        email: email,
      });

      if (!user) {
        console.error('해당 이메일은 토이스쿼드 회원이 아닙니다.');
        return false;
      }

      // 패스워드 재설정 토큰을 확인한다.
      const isMatchedToken = await this.authService.checkResetPasswordToken({
        resetPasswordToken: token,
        userId: user.id,
      });

      return isMatchedToken;
    } catch (error) {
      throw error;
    }
  }
}
