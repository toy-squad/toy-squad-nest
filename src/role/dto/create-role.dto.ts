import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { Project } from "projects/entities/project.entity";
import { User } from "users/entities/user.entity";

export class CreateRoleDto {

    @IsNotEmpty()
    @IsString()
    role: string;
    
    //todo: project id 유효성 검사
    @Type(() => Project)
    @IsNotEmpty()
    project: Project;

    //todo: user id 유효성 검사
    @Type(() => User)
    @IsNotEmpty()
    user: User;
}
