import { IsNumber } from 'class-validator';

export const DEFAULT_PAGE = 1;
export const DEFAULT_TAKE = 10;

export class PaginationQueryDto {
  // 조회할 페이지번호
  @IsNumber()
  page: number;

  // 페이지당 최대개수
  @IsNumber()
  take: number;
}
