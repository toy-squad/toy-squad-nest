import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
   * - request: category
   * -          category: 개발자/기획자/디자이너 포지션
   * - response: map[category]
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
  async generateNewUser(@Body() dto: CreateUserRequestDto) {
    const newUser = await this.userService.createUser(dto);
    return newUser;
  }

  /**
   * 상세 포지션 선택
   * URL: /api/users/position
   */
  @Get('/position')
  async getDetailPositions(@Query('position') categoryPosition: any) {
    const detailPosition = await this.userService.getDetailPositions(
      categoryPosition,
    );
    return detailPosition;
  }

  /**
   * 마이페이지
   * URL: /api/users/my
   *
   * - 내가 작성한 댓글 & 답글
   * - 내가 참여한 프로젝트
   * - 내가 완료한 프로젝트
   * - 내가 받은 프로젝트 제안
   * - 내가 생성한 프로젝트
   * - 내가 작성한 전시물
   *
   */
  @Get('/my')
  async getMyPage() {}

  /**
   * 유저목록 조회 API
   * URL: /api/users/list
   */
  @Get('/list')
  async getUsers(@Query('page') page: number) {}

  /**
   * 유저 상세 페이지
   * URL: /api/users/detail/:id
   */
  @Get('/detail/:id')
  async getUserDetail(@Param('id') userId: string) {}

  /**
   * 유저정보 수정
   * URL: /api/users/:id
   */
  @Put('/:id')
  async updateUserInfo() {}

  /**
   * 회원탈퇴
   * URL: /api/users/:id
   */
  @Delete('/:id')
  async deleteUser(@Param('id') userId: string) {
    return await this.userService.deleteUser(userId);
  }
}
