import { IsNotEmpty, IsString } from "class-validator";

export class UpdateProjectRequestDto {
    @IsNotEmpty()
    @IsString()
    name: string; // 프로젝트명
  }