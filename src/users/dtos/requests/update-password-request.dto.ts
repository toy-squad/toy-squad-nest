import { PickType } from '@nestjs/mapped-types';
import {
  UpdateUserInfoServiceDto,
  UpdateUserInfoRequestDto,
} from 'users/dtos/requests/update-user-info-request.dto';

export interface UpdatePassword {
  password: string;
  passwordConfirm: string;
}

export class UpdatePasswordRequestDto
  extends PickType(UpdateUserInfoServiceDto, ['userId', 'password'] as const)
  implements UpdatePassword
{
  password: string;
  passwordConfirm: string;
}
