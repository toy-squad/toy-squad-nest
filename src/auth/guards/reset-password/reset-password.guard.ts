import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'auth/auth.service';

@Injectable()
export class ResetPasswordGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 쿠키에서 갖고온다
    const { reset_password } = request.cookies;

    // 패스워드 재설정 토큰을 확인한다.
    const result = (await this.authService.checkResetPasswordToken({
      resetPasswordToken: reset_password,
    }))
      ? true
      : false;

    return result;
  }
}
