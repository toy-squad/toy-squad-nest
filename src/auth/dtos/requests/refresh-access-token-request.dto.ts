import { IsNotEmpty } from 'class-validator';

export class RefreshAccessTokenRequestDto {
  @IsNotEmpty({ message: 'user_id이 존재하지 않습니다.' })
  user_id: string;

  @IsNotEmpty({ message: 'refresh_token이 존재하지 않습니다.' })
  refresh_token: string;
}
