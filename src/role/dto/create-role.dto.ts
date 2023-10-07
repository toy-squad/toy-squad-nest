import { IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {

    @IsNotEmpty()
    @IsString()
    role: string;

    @IsNotEmpty()
    @IsString()
    project_id: string;

    @IsNotEmpty()
    @IsString()
    user_id: string;
}
