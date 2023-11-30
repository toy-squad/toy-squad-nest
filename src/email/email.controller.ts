import { Request, Response } from 'express';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'auth/decorators/public.decorator';
import { UsersService } from 'users/users.service';
import { SendEmailForResetPwdRequestDto } from './dtos/requests/send-email-for-reset-request.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailRequestDto } from './dtos/requests/send-email-request.dto';
import { ResetPassword } from 'auth/decorators/reset-password.decorator';
import { AuthService } from 'auth/auth.service';
import { CheckResetPasswordTokenAndRedirectResetUiRequestDto } from 'auth/dtos/requests/check-reset-password-token-request.dto';

@ApiTags('이메일 API')
@Controller('email')
export class EmailController {
  private RESET_PASSWORD_FORM_URL: string;
  private FRONTEND_URL: string;
  private SERVER_URL: string;

  constructor(
    // private readonly emailService: EmailService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly mailService: MailerService,
    private readonly authService: AuthService,
  ) {
    this.RESET_PASSWORD_FORM_URL = this.configService.get(
      'RESET_PASSWORD_FORM_URL',
    );
    this.FRONTEND_URL = this.configService.get('FRONTEND_URL');
    this.SERVER_URL = this.configService.get('SERVER_URL');
  }

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
  @Post('pwd')
  @Public()
  @ApiOperation({
    summary: '비밀번호 재설정 요청 이메일 입력',
    description:
      '로그인 페이지에서 "비밀번호 찾기" 버튼 클릭 후에 비밀번호를 찾을 이메일을 입력합니다.',
  })
  async sendEmailForResetPwd(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: SendEmailForResetPwdRequestDto,
  ) {
    try {
      // 입력한 이메일에 대한 회원이 존재하는지 확인
      const user = await this.userService.findOneUser({
        email: dto.inputEmail,
        allowPassword: false,
      });

      if (!user) {
        throw new NotFoundException('존재하지 않은 회원입니다.');
      }

      // 레디스에 비밀번호재설정 토큰 등록
      // 비밀번호 재설정토큰은 비밀번호재설정 당시 시각을 나타냈다.
      const resetPasswordToken =
        await this.authService.generateResetPasswordToken({
          userId: user.id,
        });

      // 이메일 전송
      await this.mailService.sendMail({
        to: dto.inputEmail,
        from: 'admin@toysquad.com',
        subject: '비밀번호 재설정 안내',
        template: './reset_password_info',
        context: {
          userName: user.name,

          // 비밀번호 토큰 유효성 확인
          resetPasswordBtnUrl: `${this.SERVER_URL}/email/pwd?token=${resetPasswordToken}&email=${dto.inputEmail}`,
        },
      });

      return res.status(200).json({
        message: '메일전송완료',
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('pwd')
  @ApiOperation({
    summary: '비밀번호 재설정 토큰 검사 및 새로운 비밀번호 입력폼',
    description:
      '이메일에서 "비밀번호 재설정" 버튼을 클릭하면 비밀번호 재설정 토큰이 유효성 검사에서 이상없으면 비밀번호 재설정 UI폼으로 리다이렉트합니다.',
  })
  @ApiQuery({
    type: CheckResetPasswordTokenAndRedirectResetUiRequestDto,
  })
  @ResetPassword()
  async checkResetPasswordTokenAndRedirectResetUI(
    @Query() dto: CheckResetPasswordTokenAndRedirectResetUiRequestDto, // resetPasswordToken
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // 비밀전호 재설정 UI폼으로 리다이렉트
    const { token, email } = req.query;
    return res
      .status(200)
      .redirect(`${this.FRONTEND_URL}/updatePw?token=${token}&email=${email}`);
  }
}
