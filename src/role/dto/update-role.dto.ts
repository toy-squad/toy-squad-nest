import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {

    // @IsNotEmpty()
    // @IsString()
    // projectId: string;

    // @IsNotEmpty()
    // @IsString()
    // userId: string;
}
