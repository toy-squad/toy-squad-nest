import { IsOptional } from 'class-validator';

// ResetPasswordGuard
export class CheckResetPasswordTokenRequestDto {
  userId: string;
  resetPasswordToken: string;
}

export class CheckResetPasswordTokenAndRedirectResetUiRequestDto {
  email: string;
  token: string;
}
