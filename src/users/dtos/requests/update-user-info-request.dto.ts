import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserInfoRequestDto {
  // required : 수정할 회원 아이디
  @IsNotEmpty()
  @IsString()
  userId: string;

  // optional : 수정정보
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  imgUrl?: string;

  @IsOptional()
  tendency?: string[];

  @IsOptional()
  skills: string[];

  @IsOptional()
  fields: string[];

  @IsOptional()
  @IsString()
  positionCategory?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  intro?: string;
}
