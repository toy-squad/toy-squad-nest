import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  FileTypeValidator,
  Get,
  Logger,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Patch,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { DEFAULT_PAGE, DEFAULT_TAKE } from 'commons/dtos/pagination-query-dto';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResetPassword } from 'auth/decorators/reset-password.decorator';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Public } from 'auth/decorators/public.decorator';
import { FindAndUpdatePasswordRequestDto } from './dtos/requests/find-and-update-password-request.dto';
import { positionCategory } from './types/position.type';
import { UpdateUserInfoRequestDto } from './dtos/requests/update-user-info-request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import RequestWithUser from 'auth/interfaces/request-with-user.interface';
import {
  UPLOAD_IMAGE_MAX_SIZE,
  VALID_IMAGE_FILE_TYPES_REGEX,
} from 'commons/constants/FILE_CONSTANT';
import { UpdateLikesValueRequestDto } from './dtos/requests/update-likes-value-request.dto';

@ApiTags('유저 API')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  private FRONTEND_URL;
  private BUCKET_NAME;

  constructor(
    private readonly userService: UsersService,
    private configService: ConfigService,
  ) {
    this.FRONTEND_URL = this.configService.get('FRONTEND_URL');
  }

  /**
   * 상세 포지션 선택
   * URL: /api/users/position
   * - request: category
   * -          category: 개발자/기획자/디자이너 포지션
   * - response: map[category]
   */
  @Public()
  @Get('/position')
  @ApiOperation({
    summary: '회원가입 포지션 선택 API',
    description: '좌측: 카테고리 포지션, 우측: 상세 포지션',
  })
  @ApiQuery({
    name: 'position',
    enum: ['DEVELOPER', 'DESIGNER', 'MANAGER'],
  })
  @ApiOkResponse({
    description:
      '포지션 카테고리(DEVELOPER / DESIGNER / MANAGER)에 대한 상세 포지션 리스트를 반환한다.',
  })
  async getDetailPositions(
    @Query('position') categoryPosition: positionCategory,
  ) {
    const detailPosition = await this.userService.getDetailPositions(
      categoryPosition,
    );
    return {
      categoryPosition: categoryPosition,
      detailPosition: detailPosition,
    };
  }

  /**
   * URL: /api/users
   */
  @Patch()
  @ApiResponse({
    status: 404,
    description: '존재하지 않은 회원입니다.',
  })
  async updateUserInfo(
    @Req() req: RequestWithUser,
    @Res() res: Response,
    @Body() requestDto: UpdateUserInfoRequestDto,
  ) {
    const { userId } = req.user;
    const dto = req.body;

    await this.userService.updateUserInfo({
      ...dto,
      userId: userId,
    });
    res.status(200).json('수정 완료');
  }

  // 이미지 파일 업로드
  @Patch('/profile')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '유저 정보 수정 API',
    description: '유저 정보 수정',
  })
  @ApiOkResponse({
    status: 200,
  })
  async uploadProfileImage(
    @Req() req: RequestWithUser,
    @Res() res: Response,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // 이미지 타입 검사
          new FileTypeValidator({ fileType: VALID_IMAGE_FILE_TYPES_REGEX }),

          // 이미지 크기 10MB 넘는지 검사
          new MaxFileSizeValidator({ maxSize: UPLOAD_IMAGE_MAX_SIZE }),
        ],
      }),
    )
    file?: Express.Multer.File | undefined,
  ) {
    const { userId } = req.user;
    const updatedUserInfo = await this.userService.updateUserInfo({
      userId: userId,
      imgProfileFile: file,
    });

    // 없으면 기본이미지 url을 리턴한다.
    return res.status(200).json({
      profile_url: updatedUserInfo.imgUrl ?? undefined,
    });
  }

  /**
   * 유저목록 조회 API
   * URL: /api/users/list
   */
  @Public()
  @Get('/list')
  @ApiOperation({
    summary: '유저 목록 API',
    description: '유저 리스트 및 검색',
  })
  @ApiQuery({
    name: 'page',
    example: 1,
    required: false,
    description: '페이징',
  })
  @ApiQuery({
    name: 'take',
    example: 10,
    required: false,
    description: '1페이지당 게시물 최대 개수',
  })
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
   * 비밀번호 변경
   * - URL : /api/users/pwd
   */
  @Patch('pwd')
  @ApiOperation({
    summary: '비밀번호 변경',
    description:
      '비밀번호 재설정 폼에서 "비밀번호 변경" 버튼을 클릭하면 비밀번호변경 api를 호출합니다.',
  })
  @ApiBody({
    type: FindAndUpdatePasswordRequestDto,
  })
  @ApiOkResponse({
    status: 200,
    description: '비밀번호 변경 완료하였습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않은 유저입니다',
  })
  @ResetPassword()
  async findAndUpdatePwd(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: FindAndUpdatePasswordRequestDto,
  ) {
    try {
      const { email, newPassword } = req.body;
      // 유저 이메일
      const user = await this.userService.findOneUser({
        email: email,
        allowPassword: false,
      });

      if (!user) {
        throw new NotFoundException('존재하지 않은 유저입니다.');
      }

      // 비밀번호 수정
      await this.userService.updateUserInfo({
        userId: user.id,
        password: newPassword,
      });

      // 로그인페이지로 리다이렉트(프론트)
      return res.status(200).json('비밀번호 변경 완료하였습니다.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * [PATCH] /api/users/likes
   *
   *  유저 좋아요 클릭 -> likes 값만 업데이트
   * */
  @Patch('likes')
  @ApiOperation({
    summary: '단일유저 좋아요 API',
    description: '유저 1명에게 좋아요 버튼을 누르면 좋아요값이 +1 된다.',
  })
  @ApiOkResponse({
    status: 200,
    description: '좋아요 Success',
  })
  @ApiResponse({
    status: 400,
    description: '자기자신에게 좋아요를 줄 수 없습니다.',
  })
  @ApiResponse({
    status: 404,
    description:
      '존재하지 않은 회원 입니다. - 좋아요 대상 유저가 존재하지 않을 경우',
  })
  async updateLikesValue(
    @Req() req: RequestWithUser,
    @Res() res: Response,
    @Body() dto: UpdateLikesValueRequestDto,
  ) {
    // 좋아요를 준 대상과 좋아요 받은 대상이 동일한 경우
    const { user, body } = req;
    const targetUserId = dto.target_user_id
      ? dto.target_user_id
      : body.target_user_id;
    if (user.userId === targetUserId) {
      throw new BadRequestException('자기자신에게 좋아요를 줄 수 없습니다.');
    }

    // target 유저에 대한 likes 정보를 갖고온다.
    const targetUser = await this.userService.findOneUser({
      userId: dto.target_user_id,
    });
    if (!targetUser) {
      throw new NotFoundException('존재하지 않은 회원입니다.');
    }

    // 좋아요값 업데이트
    await this.userService.updateUserInfo({
      userId: targetUserId,
      likes: targetUser.likes + 1,
    });

    return res
      .status(200)
      .json(
        `좋아요 반영 완료하였습니다 : ${targetUser.likes} -> ${
          targetUser.likes + 1
        }`,
      );
  }

  /**
   * TODO
   * 유저 상세 페이지
   * URL: /api/users/:id/detail/
   * - 비밀번호 포함
   */
  @Public()
  @Get(':id/detail')
  @ApiOperation({
    summary: '[public] 유저 상세페이지 API',
    description: '유저 상세정보',
  })
  @ApiParam({
    name: 'id',
    description: '유저 PK',
  })
  @ApiOkResponse()
  async getUserDetail(@Param('id') userId: string) {
    return await this.userService.findOneUser({ userId: userId });
  }

  /**
   * 회원탈퇴
   * URL: /api/users
   */
  @Delete()
  @ApiOperation({
    summary: '회원 탈퇴 API',
    description: '회원 탈퇴 및 유저계정 삭제',
  })
  @ApiParam({
    name: 'id',
    description: '유저 PK',
  })
  @ApiOkResponse({
    description: '회원탈퇴 Success',
  })
  async deleteUser(@Req() req: RequestWithUser, @Res() res: Response) {
    try {
      const { userId } = req.user;
      await this.userService.deleteUser(userId);

      res.status(204).send();
    } catch (error) {
      throw error;
    }
  }
}
