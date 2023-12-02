import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserInfoRequestDto {
  // required : 수정할 회원 아이디
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '유저 아이다 (유저 PK)',
    required: true,
    example: 'c2e3a923-7cdb-4716-9caa-839f22639e68',
  })
  userId: string;

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
    description: '이미지',
    required: false,
  })
  @IsOptional()
  @IsString()
  imgUrl?: string;

  // TODO
  // @ApiProperty({
  //   description: '작업성향',
  //   required: false,
  //   example: '수정할 비밀번호 입력',
  // })
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
  positionCategory?: string;

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
    example: '안녕하세요. 성장하고 싶은 푸릇택 개발자 석지웅 입니다.',
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
}
