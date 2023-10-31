import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { contactType } from 'projects/enums/contactType.enum';
import { RoleType } from 'role/entities/role.entity';
import { User } from 'users/entities/user.entity';

export interface ICreateProjectDto {
  name: string;
  intro?: string;
  description?: string;
  skills?: string[];
  imgUrl?: string;
  startDate?: string;
  endDate?: string;
  productType?: string;
  fields?: string[];
  contactType?: contactType;
  place?: string;
  recruitStartDate?: string;
  recruitEndDate?: string;
}

/**
 * 프로젝트 생성 controller, service dto
 */
export class CreateNewProjectRequestDto implements ICreateProjectDto {
  // 유저 //
  @IsNotEmpty()
  userId: string; // required

  // 권한
  @IsOptional()
  @Transform(({ value }) => {
    value ?? 'G';
  })
  @IsString()
  role: RoleType;

  // 프로젝트 //
  // 프로젝트이름
  @IsNotEmpty()
  @IsString()
  name: string; // required

  // 프로젝트소개
  @IsOptional()
  @IsString()
  intro: string;

  // 프로젝트 설명
  @IsOptional()
  @IsString()
  description: string;

  // 프로젝트 주요기술
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills: string[];

  // 프로젝트 썸네일 이미지 URL
  @IsOptional()
  @IsString()
  imgUrl: string;

  // 프로젝트 시작일
  @IsOptional()
  @IsString()
  startDate: string;

  // 프로젝트 종료일
  @IsOptional()
  @IsString()
  endDate: string;

  // 프로젝트 완성품 타입
  @IsOptional()
  @IsString()
  productType: string;

  // 프로젝트 분야
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields: string[];

  // 프로젝트 대면/비대면 여부
  @IsOptional()
  @IsString()
  @IsEnum(contactType)
  contactType: contactType;

  //  프로젝트 활동 장소
  @IsOptional()
  @IsString()
  place: string;

  //  프로젝트 모집 시작일
  @IsOptional()
  @IsString()
  recruitStartDate: string;

  //  프로젝트 모집 마감일
  @IsOptional()
  @IsString()
  recruitEndDate: string;
}

/** repository dto */
export class CreateNewProjectDto implements ICreateProjectDto {
  // 유저 //
  @IsNotEmpty()
  user: User;

  // 프로젝트 //
  // 프로젝트이름
  @IsNotEmpty()
  @IsString()
  name: string; // required

  // 프로젝트소개
  @IsOptional()
  @IsString()
  intro: string;

  // 프로젝트 설명
  @IsOptional()
  @IsString()
  description: string;

  // 프로젝트 주요기술
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills: string[];

  // 프로젝트 썸네일 이미지 URL
  @IsOptional()
  @IsString()
  imgUrl: string;

  // 프로젝트 시작일
  @IsOptional()
  @IsString()
  startDate: string;

  // 프로젝트 종료일
  @IsOptional()
  @IsString()
  endDate: string;

  // 프로젝트 완성품 타입
  @IsOptional()
  @IsString()
  productType: string;

  // 프로젝트 분야
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields: string[];

  // 프로젝트 대면/비대면 여부
  @IsOptional()
  @IsString()
  @IsEnum(contactType)
  contactType: contactType;

  //  프로젝트 활동 장소
  @IsOptional()
  @IsString()
  place: string;

  //  프로젝트 모집 시작일
  @IsOptional()
  @IsString()
  recruitStartDate: string;

  //  프로젝트 모집 마감일
  @IsOptional()
  @IsString()
  recruitEndDate: string;
}
