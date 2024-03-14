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
import {
  CreateCommentRequestDto,
  DeleteCommentDto,
  GetAllCommentsDto,
} from './dto/comment.dto';
import { ApiBody, ApiHeader } from '@nestjs/swagger';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 프로젝트 모집공고에 댓글작성
  @Post()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer access token',
  })
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
  @Post('reply')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer access token',
  })
  async generateReplyComment(
    @Req() req: RequestWithUser,
    @Res() res: Response,
    @Body() requestDto: CreateCommentRequestDto,
  ) {
    const { userId } = req.user;
    const { projectId, content, parentCommentId } = req.body;
    await this.commentService.createComment({
      commentType: 'R',
      userId: userId,
      projectId: projectId,
      content: content,
      parentCommentId: parentCommentId,
    });

    return res.status(200).json({ message: '답글 작성 완료' });
  }

  // 대댓글에 멘션 답글작성
  @Post('reply/mention')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer access token',
  })
  async generateMentionReplyComment(
    @Req() req: RequestWithUser,
    @Res() res: Response,
    @Body() requestDto: CreateCommentRequestDto,
  ) {
    const { userId } = req.user;
    const { projectId, content, parentCommentId, mentionTargetCommentId } =
      req.body;
    await this.commentService.createComment({
      commentType: 'M',
      userId: userId,
      projectId: projectId,
      content: content,
      parentCommentId: parentCommentId, // 부모댓글
      mentionTargetCommentId: mentionTargetCommentId, // 멘션대상 코멘트
    });

    return res.status(200).json({ message: '멘션 답글 작성 완료' });
  }

  // 프로젝트 모집공고에 작성된 댓글(commentType: C) 조회
  @Public()
  @Get(':project_id/comments')
  @ApiBody({ type: GetAllCommentsDto })
  async getAllComments(
    @Param('project_id') projectId: string,
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
      commentLength: comments.length,
      comments: comments,
    });
  }

  // TODO
  // 댓글(C)이 갖는 대댓글(R, M) 조회
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
    const replyCommentsLength = replyComments.length;
    return res.status(200).json({
      comment_id: commentId,
      reply_comments: replyCommentsLength > 0 ? replyComments : undefined,
      reply_comments_length:
        replyCommentsLength > 0 ? replyCommentsLength : undefined,
    });
  }

  // 댓글 수정 / 대댓글 수정 / 좋아요 / 싫어요
  @Patch(':comment_id')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer access token',
  })
  async update(
    @Param('comment_id') commentId: string,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    const { commentUpdateType, newContent } = req.body;
    const { userId } = req.user;

    await this.commentService.updateComment({
      userId: userId,
      commentId: commentId,
      commentUpdateType: commentUpdateType ?? 'COMMENT',
      newContent: commentUpdateType === 'COMMENT' ? newContent : undefined,
    });

    let message;
    switch (commentUpdateType) {
      case 'COMMENT':
        message = '댓글 수정 완료했습니다.';
        break;
      case 'LIKE':
        message = '좋아요 반영 완료했습니다';
        break;
      case 'DISLIKE':
        message = '싫어요 반영 완료했습니다';
        break;
    }

    return res.status(200).json({ message });
  }

  // 코멘트 아이디에 해당되는 코멘트 삭제(soft-delete)
  @Delete(':comment_id')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer access token',
  })
  @ApiBody({
    type: DeleteCommentDto,
  })
  async remove(
    @Param('comment_id') commentId: string,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    const { userId } = req.user;
    await this.commentService.removeComment({
      userId: userId,
      commentId: commentId,
    });
    return res.status(200).json({ message: '댓글 삭제 성공하였습니다.' });
  }
}
