import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'auth/auth.service';
import { ValidateUserRequestDto } from 'auth/dtos/requests/validate-user-request.dto';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(dto: ValidateUserRequestDto) {
    const user = await this.authService.validateUser(dto);
    if (!user) {
      throw new UnauthorizedException('유저 인증에 실패하였습니다.');
    }
    return user;
  }
}
