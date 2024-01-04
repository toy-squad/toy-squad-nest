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
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { Response } from 'express';
import RequestWithUser from 'auth/interfaces/request-with-user.interface';
import { Public } from 'auth/decorators/public.decorator';
import { DEFAULT_PAGE, DEFAULT_TAKE } from 'commons/dtos/pagination-query-dto';
import { CreateCommentRequestDto } from './dto/comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 프로젝트 모집공고에 댓글작성
  @Post()
  async createComment(
    @Req() req: RequestWithUser,
    @Res() res: Response,
    @Body() requestDto: CreateCommentRequestDto,
  ) {
    await this.commentService.createComment({
      commentType: 'C',
      userId: req.user.userId,
      projectId: req.body.projectId,
      content: req.body.content,
    });

    return res.status(200).json({ message: '댓글 작성 완료' });
  }

  // 대댓글 작성
  @Post(':comment_id/reply')
  async generateReplyComment(
    @Req() req: RequestWithUser,
    @Res() res: Response,
    @Body() requestDto: CreateCommentRequestDto,
  ) {
    await this.commentService.createComment({
      commentType: 'R',
      userId: req.user.userId,
      projectId: req.body.projectId,
      content: req.body.content,
      parentCommentId: req.body.parentCommentId,
    });

    return res.status(200).json({ message: '대댓글 작성 완료' });
  }

  // 대댓글에 해시태그 답글작성
  @Post(':comment_id/reply/hashtag')
  async generateHashtagReplyComment(
    @Req() req: RequestWithUser,
    @Res() res: Response,
    @Body() requestDto: CreateCommentRequestDto,
  ) {
    await this.commentService.createComment({
      commentType: 'H',
      userId: req.user.userId,
      projectId: req.body.projectId,
      content: req.body.content,
      parentCommentId: req.body.parentCommentId,
      hashtagTargetCommentId: req.body.hashtagTargetCommentId,
    });

    return res.status(200).json({ message: '대댓글 작성 완료' });
  }

  // 프로젝트 모집공고에 작성된 댓글 전체 조회 + 페이징조회
  @Public()
  @Get(':project_id')
  async getAllComments(
    @Param(':project_id') projectId: string,
    @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
    page: number,
    @Query('limit', new DefaultValuePipe(DEFAULT_TAKE), ParseIntPipe)
    limit: number,
    @Res() res: Response,
  ) {
    const comments = await this.commentService.findAllCommentsByProjectId({
      page: page,
      take: limit,
      projectId: projectId,
    });

    // comment: 프로젝트 모집공고에 있는 댓글들(대댓글X), 대댓글 개수
    return res.status(200).json({
      project_id: projectId,
      comments: comments,
    });
  }

  // 댓글이 갖는 대댓글 조회
  @Public()
  @Get(':comment_id')
  async getAllReplyComments(
    @Param('comment_id') commentId: string,
    @Res() res: Response,
  ) {
    const replyComments =
      await this.commentService.getAllReplyCommentsByCommentId(commentId);

    /**
     * comment_id: 댓글 아이디
     * reply_comments: 대댓글
     */
    return res
      .status(200)
      .json({ comment_id: commentId, reply_comments: replyComments });
  }

  // 댓글 수정 / 대댓글 수정
  @Patch(':comment_id')
  async update(
    @Param('comment_id') commentId: string,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    const { user, commentUpdateType } = req.body;

    await this.commentService.updateComment({
      userId: user.userId,
      commentId: commentId,
      commentUpdateType: commentUpdateType ?? 'COMMENT',
      newContent:
        commentUpdateType === 'COMMENT' ? req.body.newContent : undefined,
    });

    return res.status(200).json({ message: '댓글 수정 성공하였습니다.' });
  }

  // 댓글 삭제 / 대댓글 삭제 (not soft delete)
  // 댓글삭제되면 대댓글도 같이 삭제된다.
  @Delete(':comment_id')
  async remove(
    @Param('comment_id') commentId: string,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    const { user } = req.body;
    await this.commentService.removeComment({
      userId: user.userId,
      commentId: commentId,
    });
    return res.status(200).json({ message: '댓글 삭제 성공하였습니다.' });
  }
}
