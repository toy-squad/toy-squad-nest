import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRequestDto } from './dtos/requests/create-user-request.dto';
import { DEFAULT_PAGE, DEFAULT_TAKE } from 'commons/dtos/pagination-query-dto';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('유저 API')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly userService: UsersService) {}

  /**
   * 회원가입 API
   * URL: /api/users
   */
  @ApiOperation({
    summary: '회원가입 API',
    description: '일반 회원가입',
  })
  @Post()
  async generateNewUser(@Body() dto: CreateUserRequestDto) {
    const newUser = await this.userService.createUser(dto);
    return newUser;
  }

  /**
   * 상세 포지션 선택
   * URL: /api/users/position
   * - request: category
   * -          category: 개발자/기획자/디자이너 포지션
   * - response: map[category]
   */
  @ApiOperation({
    summary: '회원가입 포지션 선택 API',
    description: '좌측: 카테고리 포지션, 우측: 상세 포지션',
  })
  @ApiCreatedResponse({
    description: '선택 카테고리에 대응되는 상세포지션 리스트를 반환한다',
  })
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
  @ApiOperation({
    summary: '마이페이지 API',
    description: '로그인 유저 마이페이지',
  })
  @Get('/mypage')
  async getMyPage() {}

  /**
   * 유저목록 조회 API
   * URL: /api/users/list
   */
  @ApiOperation({
    summary: '유저 목록 API',
    description: '유저 리스트 및 검색',
  })
  @Get('/list')
  async getUsers(
    @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
    page: number,
    @Query('take', new DefaultValuePipe(DEFAULT_TAKE), ParseIntPipe)
    take?: number,
  ) {
    return await this.userService.findUserList({
      page: page,
      take: take,
    });
  }

  /**
   * 유저 상세 페이지
   * URL: /api/users/:id/detail/
   */
  @ApiOperation({
    summary: '유저 상세페이지 API',
    description: '유저 상세정보',
  })
  @Get('/:id/detail')
  async getUserDetail(@Param('id') userId: string) {
    return await this.userService.findOneUser({ userId: userId });
  }

  /**
   * 유저정보 수정
   * URL: /api/users/:id
   */
  @ApiOperation({
    summary: '유저 정보 수정 API',
    description: '유저 정보 수정',
  })
  @Patch('/:id')
  async updateUserInfo(@Param('id') userId: string, @Body() dto: any) {
    return await this.userService.updateUserInfo({ userId, ...dto });
  }

  /**
   * 회원탈퇴
   * URL: /api/users/:id
   */
  @ApiOperation({
    summary: '회원 탈퇴 API',
    description: '회원 탈퇴 및 유저계정 삭제',
  })
  @Delete('/:id')
  async deleteUser(@Param('id') userId: string) {
    try {
      await this.userService.deleteUser(userId);
    } catch (error) {
      throw error;
    }
  }
}
