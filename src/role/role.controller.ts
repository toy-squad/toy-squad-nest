import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import RequestWithUser from 'auth/interfaces/request-with-user.interface';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  private readonly logger = new Logger(RoleController.name);

  //TODO 생성자 권한 role insert controller(userId, projectId, roleId)
  
  @Post()
  async create(@Req() request: RequestWithUser, @Res() response: Response) {
    this.logger.log(request.body);
    this.logger.log(request.user);
    //await this.roleService.create(request.body, request.user.userId);
    return response.json();
  }

  @Get()
  async findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
