import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const validateUser = (await this.authService.validateUser(request))
      ? true
      : false;
    return validateUser;
  }
}
