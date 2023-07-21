import { IsNotEmpty, IsString } from 'class-validator';

/**
 * 프로젝트 생성할때 반드시 넣어야할 정보
 *
 * - 일단은 not null인 데이터로 인풋받아서 프로젝트생성되는지 테스트
 */
export class CreateNewProjectRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string; // 프로젝트명
}
