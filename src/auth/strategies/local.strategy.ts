import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'auth/auth.service';
import { ValidateUserRequestDto } from 'auth/dtos/requests/validate-user-request.dto';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(dto: ValidateUserRequestDto) {
    try {
      const user = await this.authService.validateUser(dto);
      if (!user) {
        throw new UnauthorizedException('유저 인증에 실패하였습니다.');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
