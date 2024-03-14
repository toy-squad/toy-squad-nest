import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Project } from 'projects/entities/project.entity';
import { RoleType } from 'entities/role.entity';
import { User } from 'entities/user.entity';

export class CreateRoleDto {
  // 권한
  @IsOptional()
  @IsString()
  role: RoleType;

  @IsNotEmpty()
  @Type(() => Project)
  project: Project;

  @IsNotEmpty()
  @Type(() => User)
  user: User;
}
