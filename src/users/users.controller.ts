import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly userService: UsersService) {}
  /**
   * 포지션 요청 API
   * - request: prePosition
   * -          prePosition: 개발자/기획자/디자이너 포지션
   * - response: map[prePosition]
   * @param GetPositionDetailRequestDto
   */

  @Get()
  async() {
    this.logger.log('hello');
  }

  /**
   * 회원가입 API
   */
  @Post()
  async generateNewUser(@Body() dto: CreateUserRequestDto) {
    try {
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  @Get('/position')
  async getDetailPositions(@Query('position') position: any) {
    try {
      const result = await this.userService.getDetailPositions(position);
      return result;
    } catch (e) {
      console.error(e.message);
      throw e;
    }
  }
}
