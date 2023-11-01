import { Request, Response } from 'express';
import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('이메일 API')
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

  /**
   * 이메일 인증
   * - 비밀번호 찾기
   *
   * - 이메일입력 -> 입력한 이메일에 비밀번호 찾기 template를 보내준다.
   * - 유효시간 6시간짜리 비밀번호 찾기 토큰을 심어준다
   * - 비밀번호 수정가능한 시간:
   */
}
