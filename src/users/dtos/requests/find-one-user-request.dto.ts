import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class FindUserRequestDto {
  @IsOptional()
  @IsString()
  email?: string | undefined;

  @IsOptional()
  @IsString()
  userId?: string | undefined;

  @IsOptional()
  @IsString()
  phone?: string | undefined;

  @Transform((p) => p ?? false)
  @IsBoolean()
  allowPassword?: boolean;
}
