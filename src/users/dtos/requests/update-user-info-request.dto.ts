import { PartialType } from '@nestjs/mapped-types';
import { OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserInfoRequestDto {
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
  tendency?: string[];

  @IsOptional()
  skills?: string[];

  @IsOptional()
  fields?: string[];

  @IsOptional()
  @IsString()
  positionCategory?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  intro?: string;

  // 카카오 아이디
  @IsOptional()
  kakaoAuthId?: any;

  // 구글 아이디
  @IsOptional()
  googleAuthId?: any;

  // 이미지 프로필 파일
  @IsOptional()
  imgProfileFile?: Express.Multer.File;
}

export class UpdateUserInfoServiceDto extends PartialType(
  UpdateUserInfoRequestDto,
) {
  // required : 수정할 회원 아이디
  @IsNotEmpty()
  @IsString()
  userId: string;

  // 이미지 프로필 파일 url
  @IsOptional()
  imgUrl?: string;
}

export class UpdateUserInfoRepositoryDto extends OmitType(
  UpdateUserInfoServiceDto,
  ['imgProfileFile'] as const,
) {}
