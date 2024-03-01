import { ApiProperty } from '@nestjs/swagger';
import { MyPageLikesInfoResponseDto } from 'likes/dto/response-dto';
import { User } from 'users/entities/user.entity';

interface IMyPageResponse {
  // 로그인 유저정보
  profile: User;

  // 좋아요 정보 : (로그인유저가) 받은 좋아요 & 누른 좋아요
  likes: MyPageLikesInfoResponseDto;

  // TODO
  // 댓글/답글 정보
  //   comments

  // TODO
  // 프로젝트 관리 정보
  //   projects

  // TODO
  // 리뷰정보
}

export class MyPageResponseDto implements IMyPageResponse {
  @ApiProperty({
    description: '마이페이지 - 프로필관리 > 유저정보 데이터',
  })
  profile: User;

  @ApiProperty({
    description: '마이페이지 - 유저관리 > 받은 좋아요 & 누른 좋아요 데이터',
  })
  likes: MyPageLikesInfoResponseDto;

  @ApiProperty({
    description:
      '마이페이지 - 유저관리 > 댓글/답글 관리 (유저가 작성한 댓글/답글 리스트)',
  })
  comments: any;
}
