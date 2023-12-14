import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 프로젝트 모집공고에 댓글작성
  @Post()
  async createComment(@Req() req: Request, @Res() res: Response) {
    return await this.commentService.createComment({});
  }

  // 대댓글 작성
  @Post(':comment_id/reply')
  async generateReplyComment(@Req() req: Request, @Res() res: Response) {
    return await this.commentService.createComment({});
  }

  // 대댓글에 해시태그 답글작성
  @Post(':comment_id/reply/hashtag')
  async generateHashtagReplyComment(@Req() req: Request, @Res() res: Response) {
    return await this.commentService.createComment({});
  }

  // 프로젝트 모집공고에 작성된 댓글 전체 조회 + 페이징조회
  @Get(':project_id')
  async getAllComments(
    @Param(':project_id') projectId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return await this.commentService.findAllCommentsByProjectId();
  }

  // 댓글 및 대댓글 포함 댓글 조회
  @Get(':comment_id')
  async getAllReplyComments(
    @Param('comment_id') commentId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return await this.commentService.getAllReplyCommentsByCommentId();
  }

  // 댓글 수정 / 대댓글 수정
  @Patch(':comment_id')
  async update(
    @Param('comment_id') commentId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // 본인이 작성한 글인지 검사
    return await this.commentService.updateComment();
  }

  // 댓글 삭제 / 대댓글 삭제 (not soft delete)
  // 댓글삭제되면 대댓글도 같이 삭제된다.
  @Delete(':comment_id')
  async remove(
    @Param('comment_id') commentId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // 본인이 작성한 글인지 검사
    return await this.commentService.removeComment();
  }
}
