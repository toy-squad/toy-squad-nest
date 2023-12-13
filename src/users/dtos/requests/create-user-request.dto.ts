import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    required: true,
    description: '이메일',
    example: 'test1@yopmail.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    required: true,
    description: '비밀번호',
    example: '8자 이상',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    required: true,
    description: '이름',
    example: '석지웅',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    required: false,
    description: '휴대전화번호',
    example: '010-1234-5678',
  })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({
    required: false,
    description: '선호분야',
    example: ['어린이', '스포츠', '금융'],
  })
  @IsOptional()
  @IsArray()
  fields: string[];

  @ApiProperty({
    required: true,
    description:
      '포지션 카테고리 - 개발자(DEVELOPER), 디자이너(DESIGNER), 기획자(MANAGER) 중 한개 선택',
    example: 'DEVELOPER',
  })
  @IsString()
  position_category: positionCategory;

  @ApiProperty({
    required: true,
    description: '세부 포지션',
    example: '웹 풀스택 개발자',
  })
  @IsString()
  position: string; // 세부포지션선택

  @ApiProperty({
    required: false,
    description: '자기소개',
    example: '안녕하세요. 성장하고 싶은 풀스택 개발자 석지웅 입니다.',
  })
  @IsOptional()
  @IsString()
  intro: string;

  @ApiProperty({
    required: false,
    description: '보유 스킬',
    example: ['Typescript', 'React JS', 'Node JS', 'Github'],
  })
  @IsOptional()
  @IsArray()
  skills: string[];
}
