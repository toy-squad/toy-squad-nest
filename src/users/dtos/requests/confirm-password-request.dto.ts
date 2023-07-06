import { IsNotEmpty, IsString } from 'class-validator';
export class ConfirmPasswordRequestDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  plainTextPassword: string;
}
