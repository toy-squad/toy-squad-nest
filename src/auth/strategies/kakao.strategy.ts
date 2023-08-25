import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'auth/auth.service';
import TokenPayload from 'auth/interfaces/token-payload.interface';
import { Strategy } from 'passport-kakao';
import { UpdateUserInfoRequestDto } from 'users/dtos/requests/update-user-info-request.dto';
import { UsersService } from 'users/users.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_SECRET_KEY,
      callbackURL: process.env.KAKAO_DEV_CALLBACK_URL,
    });
  }

  /**
   * @param profile         : 프로필값이 존재하면 카카오서버에서 갖고온 계정정보이다.
   */
  async validate(accessToken: string, refreshToken: string, profile: any) {
    try {
      // 카카오톡에 계정이 존재하는지 확인
      if (!profile) {
        throw new NotFoundException('해당 계정을 찾을 수 없습니다.');
      }

      // 카카오 서버 유저구분자와 이메일정보
      const { id, ..._profile } = profile;
      const email = _profile?._json?.kakao_account?.email;

      if (!email) {
        throw new NotFoundException('해당 계정을 찾을 수 없습니다.');
      }

      // 카카오톡에 계정이 존재하나, 토이스쿼드에 계정이 존재하지 않은 경우
      const toySquadUser = await this.userService.findOneUser({
        email: email,
        allowPassword: false,
      });

      if (!toySquadUser) {
        throw new NotFoundException(
          '토이스쿼드에서는 존재하지 않은 회원입니다. 회원가입후에 다시 시도해주세요.',
        );
      }

      if (!toySquadUser.kakaoAuthId) {
        // 토이스쿼드 회원이지만, 카카오 연동로그인을 하지 않은경우
        // - db 업데이트로 카카오 아이디 값을 업데이트한다.
        await this.userService.updateUserInfo({
          userId: toySquadUser.id,
          kakaoAuthId: id, // 카카오 아이디
        });
      }

      const payload: TokenPayload = { email: email, userId: toySquadUser.id };
      return payload;
    } catch (error) {
      throw error;
    }
  }
}
