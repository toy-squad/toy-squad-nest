import { IVerifyUser } from 'auth/interfaces/verify-user.interface';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * 사용되는 서비스 함수
 * - signIn()
 * - validateUser()
 **/
export class ValidateUserRequestDto implements IVerifyUser {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
