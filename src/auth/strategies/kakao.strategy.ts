import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'auth/auth.service';
import TokenPayload from 'auth/interfaces/token-payload.interface';
import { Strategy } from 'passport-kakao';
import { UpdateUserInfoRequestDto } from 'users/dtos/requests/update-user-info-request.dto';
import { SendEmailToNewUserEvent } from 'users/events/send-email-to-new-user.event';
import { UsersService } from 'users/users.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_SECRET_KEY,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
      scope: ['account_email', 'profile_nickname', 'profile_image'],
    });
  }

  /**
   * @param profile         : 프로필값이 존재하면 카카오서버에서 갖고온 계정정보이다.
   */
  async validate(accessToken: string, refreshToken: string, profile: any) {
    try {
      // 카카오톡에 계정이 존재하는지 확인
      if (!profile) {
        throw new NotFoundException(
          '해당 카카오 이메일을 계정을 찾을 수 없습니다.',
        );
      }

      // 카카오 서버 유저구분자와 이메일정보
      const { id, ..._profile } = profile;
      const email = _profile?._json?.kakao_account?.email;

      const name = _profile?._json?.kakao_account?.profile_nickname ?? email;

      if (!email) {
        throw new NotFoundException('해당 카카오 계정을 찾을 수 없습니다.');
      }

      // 카카오톡에 계정이 존재하나, 토이스쿼드 회원으로 등록 여부 확인
      let toySquadUser = await this.userService.findOneUser({
        email: email,
        allowPassword: false,
      });

      if (!toySquadUser) {
        // 토이스쿼드 회원이 아닌데 카카오 연동로그인을 한 경우 -> db에 등록한다.
        const newUser = await this.userService.createUser({
          email: email,
          password: `toysquad+${Date.now()}+${email}`, // 임시 패스워드
          name: name,
        });

        // - db 업데이트로 카카오 아이디 값을 업데이트한다.
        await this.userService.updateUserInfo({
          userId: newUser.id,
          kakaoAuthId: id, // 카카오 아이디
        });

        toySquadUser = await this.userService.findOneUser({
          email: email,
          allowPassword: false,
        });

        // 회원가입 환영 이메일 전송
        const sendEmailToNewUserEvent: SendEmailToNewUserEvent = {
          email: newUser.email,
          name: newUser.name,
        };

        this.eventEmitter.emit(
          'send.email.to.new.user',
          sendEmailToNewUserEvent,
        );
      }

      const payload: TokenPayload = { email: email, userId: toySquadUser.id };
      return payload;
    } catch (error) {
      throw error;
    }
  }
}
