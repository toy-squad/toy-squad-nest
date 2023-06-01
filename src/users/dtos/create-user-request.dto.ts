import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateUserRequestDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsArray()
  fields: string[];

  @IsNotEmpty({ message: '포지션을 선택해주세요.' })
  @IsString()
  position: string; // 세부포지션선택

  @IsOptional()
  @IsString()
  intro: string;

  @IsOptional()
  @IsArray()
  skills: string[];
}
