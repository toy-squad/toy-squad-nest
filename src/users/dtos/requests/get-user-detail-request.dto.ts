import { IsNotEmpty, IsString } from 'class-validator';
export class GetUserDetailRequestDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}
