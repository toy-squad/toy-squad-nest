import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from 'users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: TokenPayload) {
    // payload가 유효한지 확인한다.

    const { userId, email } = payload;

    // [todo] 레디스에 key(userId) 가 캐시히트되는지 확인 -> 캐시 히트안되면 로그인 에러처리한다.
    const access_token = await this.cacheManager.get(userId);
    if (!access_token) {
      throw new UnauthorizedException(
        '유저토큰의 유효기간이 지났습니다. 다시 로그인해주세요.',
      );
    }
    // 로그인하려는 유저가 올바른 유저인지 확인한다.
    const user = await this.usersService.findOneUser({
      userId: userId,
      email: email,
    });

    return user;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
