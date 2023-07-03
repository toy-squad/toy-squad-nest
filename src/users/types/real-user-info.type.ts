import { Users } from 'users/entities/user.entity';

/**
 * password, kakaoAuthId, googleAuthId, createdAt, deletedAt
 *
 * 위의 필드를 제외한 나머지는 유저정보로 공개한다.
 */
export type RealUserInfoType = Omit<
  Users,
  'password' | 'kakaoAuthId' | 'googleAuthId' | 'createdAt' | 'deletedAt'
>[];
