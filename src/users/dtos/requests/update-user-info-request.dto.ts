import { PartialType } from '@nestjs/mapped-types';
import { OmitType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { positionCategory } from 'users/types/position.type';
import { Express } from 'express';

export class UpdateUserInfoRequestDto {
  // optional : 수정정보
  @ApiProperty({
    description: '비밀번호',
    required: false,
    example: '수정할 비밀번호 입력',
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    description: '이름',
    required: false,
    example: '석지웅',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: '휴대전화번호',
    required: false,
    example: '010-1234-5678',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: '작업성향',
    required: false,
    example: [
      '계획 수립과 일정 관리를 통해 프로젝트를 체계적으로 추진합니다.',
      '새로운 아이디어와 접근 방식을 통해 프로젝트에 창의성을 부여합니다.',
    ],
  })
  @IsOptional()
  tendency?: string[];

  @ApiProperty({
    description: '주요 기술(skills)',
    required: false,
    example: ['Typescript', 'React JS', 'Node JS', 'Github'],
  })
  @IsOptional()
  skills?: string[];

  @ApiProperty({
    description: '선호분야',
    required: false,
    example: ['어린이', '스포츠', '금융'],
  })
  @IsOptional()
  fields?: string[];

  @ApiProperty({
    description: '포지션 카테고리',
    required: false,
    enum: ['DEVELOPER', 'DESIGNER', 'MANAGER'],
    example: '010-1234-5678',
  })
  @IsOptional()
  @IsString()
  positionCategory?: positionCategory;

  @ApiProperty({
    description: '세부 포지션',
    required: false,
    example: '웹 풀스택 개발자',
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({
    description: '자기소개',
    required: false,
    example: '안녕하세요. 성장하고 싶은 풀스택 개발자 석지웅 입니다.',
  })
  @IsOptional()
  @IsString()
  intro?: string;

  @ApiProperty({
    description: '좋아요수',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  likes?: number;

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
  // required : 수정할 회원 PK
  @ApiProperty({
    description: '수정대상 회원 고유ID',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  // 이미지 프로필 파일 url
  @ApiProperty({
    description: '이미지',
    required: false,
  })
  @IsOptional()
  imgUrl?: string;
}

export class UpdateUserInfoRepositoryDto extends OmitType(
  UpdateUserInfoServiceDto,
  ['imgProfileFile'] as const,
) {}

// 유저 프로필 업로드 요청 dto
export class UploadProfileImageRequestDto {
  @ApiProperty({
    description:
      '업로드 프로필 이미지 파일(jpg, jpeg, png, gif 확장자 이미지만 가능)',
    required: true,
  })
  @IsNotEmpty()
  file: Express.Multer.File;
}
