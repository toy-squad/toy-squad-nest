import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'auth/auth.service';
import { IS_PUBLIC_KEY } from 'auth/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Public() 데코레이터는 컨트롤러 진입전에 Guard가 필수조건이라 하더라도
    // Guard를 거쳐 컨트롤러 내부에 진입할수 있도록 한다.
    // 전체이용자(비회원포함)들이 이용할 수 있는 API에서 적용한다.
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const isValidUser = (await this.authService.validateUser(request))
      ? true
      : false;
    return isValidUser;
  }
}
