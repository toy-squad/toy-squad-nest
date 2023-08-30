import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'auth/auth.service';
import { ValidateUserRequestDto } from 'auth/dtos/requests/validate-user-request.dto';
import TokenPayload from 'auth/interfaces/token-payload.interface';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    try {
      const user = await this.authService.validateUser({
        email: email,
        password: password,
      });
      if (!user) {
        throw new UnauthorizedException('유저 인증에 실패하였습니다.');
      }

      const payload: TokenPayload = { email: user.email, userId: user.id };
      return payload;
    } catch (error) {
      throw error;
    }
  }
}
