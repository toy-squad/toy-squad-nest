import { ApiProperty } from "@nestjs/swagger";
import { Project } from "projects/entities/project.entity";

export class GetProjectsResponseDto {
    @ApiProperty({ description: '프로젝트 리스트' })
    data: Project[];
    @ApiProperty({ description: '프로젝트 리스트 총 개수' })
    count: number;
    @ApiProperty({ description: '페이지 번호' })
    page: number;
    @ApiProperty({ description: '페이지당 데이터 갯수' })
    limit: number;
}