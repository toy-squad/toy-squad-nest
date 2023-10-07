import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { contactType } from 'projects/enum/contactType.enum';

/**
 * 프로젝트 생성할때 반드시 넣어야할 정보
 *
 * - 일단은 not null인 데이터로 인풋받아서 프로젝트생성되는지 테스트
 */
export class CreateNewProjectRequestDto {

  // 유저정보

  // - 1) 유저아이디
  @IsString()
  @IsNotEmpty()
  userId: string;

  // 프로젝트정보

  // - 1) 프로젝트이름
  @IsNotEmpty()
  @IsString()
  name: string; 

  // - 2) 프로젝트소개
  @IsOptional()
  @IsString()
  intro: string;

  // - 3) 프로젝트 주요기술
  @IsOptional()
  @IsArray()  
  @IsString({each: true})
  skills: string[];

  // - 4) 프로젝트 썸네일 이미지 URL
  @IsOptional()
  @IsString()
  imgUrl: string;

  // - 5) 프로젝트 시작일
  @IsOptional()
  @IsString()
  startDate: string;

  // - 6) 프로젝트 종료일
  @IsOptional()
  @IsString()
  endDate: string;

  // - 7) 프로젝트 완성품 타입
  @IsOptional()
  @IsString()
  productType: string;

  // - 8) 프로젝트 분야
  @IsOptional()
  @IsArray()
  @IsString({each: true})
  fields: string[];

  // - 9) 프로젝트 대면/비대면 여부
  @IsOptional()
  @IsString()
  @IsEnum(contactType)
  contactType: contactType;

  // - 10) 프로젝트 활동 장소
  @IsOptional()
  @IsString()
  place: string;

  // - 11) 프로젝트 모집 포지션
  @IsOptional()
  @IsString()
  recruitPosition: object[];

  // - 12) 프로젝트 모집 시작일
  @IsOptional()
  @IsString()
  recruitStartDate: string;

  // - 13) 프로젝트 모집 마감일
  @IsOptional()
  @IsString()
  recruitEndDate: string;

}
