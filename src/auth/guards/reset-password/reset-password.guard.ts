import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'auth/auth.service';

@Injectable()
export class ResetPasswordGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const { reset_password, reset_password_target_user } = request.cookies;
    if (user && user?.id !== reset_password_target_user?.user_id) {
      return false;
    }

    // 패스워드 재설정 토큰을 확인한다.
    const isMatchedToken = await this.authService.checkResetPasswordToken({
      resetPasswordToken: reset_password,
    });

    return isMatchedToken;
  }
}
