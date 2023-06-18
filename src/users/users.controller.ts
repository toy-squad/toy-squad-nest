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
   * URL: /api/users
   */
  @Post()
  async generateNewUser(@Body() dto: CreateUserRequestDto) {}

  /**
   * 상세 포지션 선택
   * URL: /api/users/position
   */
  @Get('/position')
  async getDetailPositions(@Query('position') position: any) {
    const result = await this.userService.getDetailPositions(position);
    return result;
  }

  /**
   * 마이페이지
   * URL: /api/users/my
   */
}
