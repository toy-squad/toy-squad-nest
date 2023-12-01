import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { SendEmailToNewUserEvent } from 'users/events/send-email-to-new-user.event';

@Injectable()
export class SendEmailToNewUserListener {
  constructor(
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
  ) {}
  @OnEvent('send.email.to.new.user')
  async handleSendEmailToNewUserEvent(event: SendEmailToNewUserEvent) {
    try {
      // 회원가입 회원 이메일을 전송한다.
      await this.mailService.sendMail({
        to: event.email,
        from: 'admin@toysquad.com',
        subject: '토이스쿼드에 가입해주셔서 감사합니다',
        template: '../../email/templates/greet_new_user.hbs',
        context: {
          userName: event.name,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
