import {
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
  ApiCreatedResponse,
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
   * TODO
   * 유저 상세 페이지
   * URL: /api/users/:id/detail/
   * - 비밀번호 포함
   */
  @Public()
  @Get(':id/detail')
  @ApiOperation({
    summary: '유저 상세페이지 API',
    description: '유저 상세정보',
  })
  @ApiParam({
    name: 'id',
    description: '유저 PK',
  })
  async getUserDetail(@Param('id') userId: string) {
    return await this.userService.findOneUser({ userId: userId });
  }

  /**
   * TODO
   * 유저정보 수정
   * URL: /api/users/:id
   */
  @Patch('/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '유저 정보 수정 API',
    description: '유저 정보 수정',
  })
  @ApiParam({
    name: 'id',
    description: '유저 PK',
  })
  async updateUserInfo(
    @Param('id') userId: string,
    @Body() dto: UpdateUserInfoRequestDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg',
        })
        .addFileTypeValidator({
          fileType: 'png',
        })
        .addFileTypeValidator({
          fileType: 'gif',
        })
        .addMaxSizeValidator({
          maxSize: 10 * 1024 * 1024, // 10MB
        })
        .build({
          fileIsRequired: false,
        }),
    )
    file?: Express.Multer.File,
  ) {
    return await this.userService.updateUserInfo({
      userId,
      ...dto,
      imgProfileFile: file,
    });
  }

  @Public()
  async uploadImg(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg',
        })
        .addFileTypeValidator({
          fileType: 'png',
        })
        .addFileTypeValidator({
          fileType: 'gif',
        })
        .addMaxSizeValidator({
          maxSize: 10 * 1024 * 1024, // 10MB
        })
        .build({
          fileIsRequired: false,
        }),
    )
    file?: Express.Multer.File,
  ) {
    console.log(file);
    return file;
  }

  /**
   * 회원탈퇴
   * URL: /api/users/:id
   */
  @Delete('/:id')
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
  async deleteUser(@Param('id') userId: string) {
    try {
      await this.userService.deleteUser(userId);
    } catch (error) {
      throw error;
    }
  }
}
