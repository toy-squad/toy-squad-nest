import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SendEmailToNewUserEvent } from 'users/events/send-email-to-new-user.event';

@Injectable()
export class SendEmailToNewUserListener {
  constructor() {}
  @OnEvent('send.email.to.new.user')
  handleSendEmailToNewUserEvent(event: SendEmailToNewUserEvent) {}
}
