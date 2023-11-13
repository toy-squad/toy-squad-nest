import {
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
    const { reset_password_target_email, reset_password } = request.cookies;
    try {
      if (!reset_password && !reset_password_target_email) {
        throw new UnauthorizedException(
          '비밀번호 재설정 유효시간이 만료되었습니다.',
        );
      }

      const user = await this.userService.findOneUser({
        allowPassword: false,
        email: reset_password_target_email,
      });

      // 패스워드 재설정 토큰을 확인한다.
      const isMatchedToken = await this.authService.checkResetPasswordToken({
        resetPasswordToken: reset_password,
        userId: user.id,
      });

      return isMatchedToken;
    } catch (error) {
      throw error;
    }
  }
}
