import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { IS_PUBLIC_KEY } from './public.decorator';
import { ResetPasswordGuard } from 'auth/guards/reset-password/reset-password.guard';

export function ResetPassword() {
  return applyDecorators(
    SetMetadata(IS_PUBLIC_KEY, true),
    UseGuards(ResetPasswordGuard),
  );
}
