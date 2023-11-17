import { IsOptional } from 'class-validator';

export class RefreshAccessTokenRequestDto {
  @IsOptional()
  userId?: string;

  @IsOptional()
  refreshToken?: string;
}
