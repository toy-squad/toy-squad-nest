import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendEmailRequestDto } from './dtos/requests/send-email-request.dto';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(dto: SendEmailRequestDto): Promise<void> {
    try {
      return await this.mailerService.sendMail({
        ...dto,
        sender: 'admin@toysquads.com',

        // to: dto.to,
        // from: dto.from,
        // subject: dto.subject,
        // text: `${dto.text}`,
        // html: `${dto.html}`,
        // attachments: [{ filename: '', path: '' }],
      });
    } catch (error) {
      throw error;
    }
  }
}
