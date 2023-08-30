import { Request, Response } from 'express';
import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { SendEmailRequestDto } from './dtos/requests/send-email-request.dto';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';

@Controller('email')
export class EmailController {
  constructor(
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}
  @Post()
  async sendEmail(@Req() req: Request, @Res() res: Response) {
    const { body } = req;
    await this.emailService.sendEmail({ ...body });
    return res.status(201).json({ message: '이메일 전송 성공!' });
  }
}
