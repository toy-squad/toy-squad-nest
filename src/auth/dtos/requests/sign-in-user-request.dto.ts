import { ValidateUserRequestDto } from './validate-user-request.dto';

export class SignInRequestDto extends ValidateUserRequestDto {
  constructor(email: string, password: string) {
    super(email, password);
  }
}
