import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ContactType, FirstPositionType, PlatformType, SecondPositionType } from 'projects/enums/projectType.enum';
import { isValidDate } from 'projects/utils/date.util';

export class GetProjectsRequestDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;

  @IsOptional()
  @IsEnum(FirstPositionType, { each: true })
  firstPosition?: FirstPositionType[];

  @IsOptional()
  @IsEnum(SecondPositionType, { each: true })
  secondPosition?: SecondPositionType[];
  
  @IsOptional()
  @IsEnum(ContactType, { each: true })
  contactType?: ContactType[];
  
  @IsOptional()
  @Type(() => Number)
  @IsInt( { each: true } )
  memberCount?: number[];
  
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    // 날짜 형식이 맞는지 검증
    if(isValidDate(value))
      return value;
    throw new Error('날짜 형식이 맞지 않습니다.');
  })
  recruitStartDate: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    // 날짜 형식이 맞는지 검증
    if(isValidDate(value))
      return value;
    throw new Error('날짜 형식이 맞지 않습니다.');
  })
  recruitEndDate: string;
  
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    // 날짜 형식이 맞는지 검증
    if(isValidDate(value))
      return value;
    throw new Error('날짜 형식이 맞지 않습니다.');
  })
  startDate: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    // 날짜 형식이 맞는지 검증
    if(isValidDate(value))
      return value;
    throw new Error('날짜 형식이 맞지 않습니다.');
  })
  endDate: string;

  @IsOptional()
  @IsString({ each: true })
  place?: string[];

  @IsOptional()
  @IsEnum(FirstPositionType, { each: true })
  field?: FirstPositionType[];

  @IsOptional()
  @IsEnum(PlatformType, { each: true })
  platform?: PlatformType[];

}
