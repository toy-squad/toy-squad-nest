import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  isEnum,
} from 'class-validator';
import { positionCategory } from 'users/types/position.type';

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

  @IsString()
  positionCategory: positionCategory;

  @IsString()
  position: string; // 세부포지션선택

  @IsOptional()
  @IsString()
  intro: string;

  @IsOptional()
  @IsArray()
  skills: string[];
}
