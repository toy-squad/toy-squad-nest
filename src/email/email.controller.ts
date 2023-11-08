import { Request, Response } from 'express';
import {
  Body,
  Controller,
  NotFoundException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'auth/decorators/public.decorator';
import { AuthService } from 'auth/auth.service';
import { UsersService } from 'users/users.service';
import { SendEmailForResetPwdRequestDto } from './dtos/requests/send-email-for-reset-request.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailRequestDto } from './dtos/requests/send-email-request.dto';

@ApiTags('이메일 API')
@Controller('email')
export class EmailController {
  constructor(
    // private readonly emailService: EmailService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly mailService: MailerService,
  ) {}

  @Public()
  @Post()
  async sendEmail(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: SendEmailRequestDto,
  ) {
    await this.mailService.sendMail({ ...dto });
    return res.status(201).json({ message: '이메일 전송 성공!' });
  }

  /**
   * - /api/email/pwd
   * 입력한 이메일에 비밀번호 재설정 이메일 탬플릿을 보내주는 API
   */
  @Public()
  @Post('pwd')
  async sendEmailForResetPwd(@Body() dto: SendEmailForResetPwdRequestDto) {
    try {
      // 입력한 이메일에 대한 회원이 존재하는지 확인
      const isValidInputEmail = (await this.userService.findOneUser({
        email: dto.inputEmail,
        allowPassword: false,
      }))
        ? true
        : false;

      if (!isValidInputEmail) {
        throw new NotFoundException('존재하지 않은 회원입니다.');
      }

      // 레디스에 비밀번호재설정 토큰 등록
      // 이메일 전송
      await this.mailService.sendMail({
        to: dto.inputEmail,
        from: 'admin@toysquad.com',
        subject: '비밀번호 재설정 안내',
        template: './reset_password_info',
        html: '',
      });
    } catch (error) {
      throw error;
    }
  }
}
