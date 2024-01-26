import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PassportStrategy } from '@nestjs/passport';
import TokenPayload from 'auth/interfaces/token-payload.interface';
import { Strategy } from 'passport-google-oauth2';
import { SendEmailToNewUserEvent } from 'users/events/send-email-to-new-user.event';
import { UsersService } from 'users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    private readonly eventEmitter: EventEmitter2,
  ) {
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

      const { id, email, displayName } = profile;
      // 토이스쿼드 데이터베이스에 이메일이 있는지 확인
      let toySquadUser = await this.userService.findOneUser({
        email: email,
        allowPassword: false,
      });

      if (!toySquadUser) {
        // 토이스쿼드 계정 생성
        const newUser = await this.userService.createUser({
          email: email,
          password: `toysquad+${Date.now()}+${email}`, // 임시패스워드
          name: displayName,
        });

        await this.userService.updateUserInfo({
          userId: newUser.id,
          googleAuthId: id, // 구글 아이디
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
