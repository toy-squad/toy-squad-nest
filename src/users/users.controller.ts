import { Controller, Get, Logger, Query } from '@nestjs/common';
import { GetPositionDetailRequestDto } from './dtos/get-position-detail-request.dto';
import { UsersService } from './users.service';

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

  @Get('/position')
  async getPosition(@Query() GetPositionDetailRequestDto) {
    try {
    } catch (error) {
      throw error;
    }
  }
}
