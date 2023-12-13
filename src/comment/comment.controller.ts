import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 댓글작성
  @Post()
  async createComment(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentService.create(createCommentDto);
  }

  // 대댓글 작성
  @Post(':id/reply')
  async generateReplyComment() {}

  // 대댓글에 해시태그 답글작성
  @Post(':id/reply/hashtag')
  async generateHashtagReplyComment() {}

  // 프로젝트 댓글 전체 조회
  @Get()
  async findAll() {
    return await this.commentService.findAll();
  }

  // 댓글(대댓글) id로 조회
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.commentService.findOne(+id);
  }
  // 프로젝트 id로 대댓글 조회
  @Get(':id/children')
  async getReplyComments() {}

  // 댓글 수정
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return await this.commentService.update(+id, updateCommentDto);
  }

  // 댓글 삭제 (softDelete)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.commentService.remove(+id);
  }
}
