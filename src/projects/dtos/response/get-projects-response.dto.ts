import { Project } from "projects/entities/project.entity";

export class GetProjectsResponseDto {
    data: Project[];
    count: number;
    page: number;
    limit: number;
}