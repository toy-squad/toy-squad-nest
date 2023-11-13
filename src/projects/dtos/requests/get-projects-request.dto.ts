import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ContactType, FirstPositionType, PlatformType, SecondPositionType } from 'projects/enums/projectType.enum';
import { DateRange } from 'projects/types/data-range.type';

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
  @IsEnum(ContactType)
  contactType?: ContactType;
  
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  memberCount?: number;
  
  @IsOptional()
  @Transform(({ value }) => {
    if (value) {
      const [start, end] = value.split(',');
      if(DateRange.isValid(start, end)){
        return new DateRange(start, end);
      }
    }
    return undefined;
  })
  recruitmentPeriod?: DateRange;
  //@Type(() => DateRange)
  
  @IsOptional()
  @Transform(({ value }) => {
    if (value) {
      const [start, end] = value.split(',');
      if(DateRange.isValid(start, end)){
        return new DateRange(start, end);
      }
    }
    return undefined;
  })
  progressPeriod?: DateRange;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(FirstPositionType, { each: true })
  field?: FirstPositionType[];

  @IsOptional()
  @IsEnum(PlatformType, { each: true })
  platform?: PlatformType[];

}
