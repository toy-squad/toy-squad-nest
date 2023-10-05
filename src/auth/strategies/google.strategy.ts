import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import TokenPayload from 'auth/interfaces/token-payload.interface';
import { Strategy } from 'passport-google-oauth2';
import { UsersService } from 'users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    cb: any,
  ) {
    try {
      // 구글계정이 존재하는지 확인
      if (!profile) {
        throw new NotFoundException(
          '해당 구글 이메일 계정을 찾을 수 없습니다.',
        );
      }

      // 구글계정이 존재하나, 토이스쿼드 회원으로 등록 여부 확인
      const { id, email } = profile._json;
      const toySquadUser = await this.userService.findOneUser({
        email: email,
        allowPassword: false,
      });

      if (!toySquadUser) {
        throw new NotFoundException(
          '토이스쿼드에서는 존재하지 않은 회원입니다. 회원가입후에 다시 시도해주세요.',
        );
      }

      if (!toySquadUser.googleAuthId) {
        // 토이스쿼드 회원이지만, 구글 연동로그인을 하지 않은경우
        // - db 업데이트로 카카오 아이디 값을 업데이트한다.
        await this.userService.updateUserInfo({
          userId: toySquadUser.id,
          googleAuthId: id, // 카카오 아이디
        });
      }

      const payload: TokenPayload = { email: email, userId: toySquadUser.id };
      return payload;
    } catch (error) {
      throw error;
    }
  }
}
