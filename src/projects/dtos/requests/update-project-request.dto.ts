import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProjectRequestDto {
  // 유저정보
  // 유저아이디
  @IsString()
  @IsNotEmpty()
  userId: string;

  // 프로젝트 정보
  // 프로젝트 아이디
  @IsString()
  @IsNotEmpty()
  projectId: string;

  // 프로젝트명
  @IsOptional()
  @IsString()
  name: string;
}
