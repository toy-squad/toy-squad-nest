import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SendEmailToNewUserEvent } from 'users/events/send-email-to-new-user.event';

@Injectable()
export class SendEmailToNewUserListener {
  constructor(private readonly mailService: MailerService) {}
  @OnEvent('send.email.to.new.user')
  handleSendEmailToNewUserEvent(event: SendEmailToNewUserEvent) {}
}
