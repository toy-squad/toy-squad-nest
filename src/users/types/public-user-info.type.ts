import { User } from 'entities/user.entity';

/**
 * password, kakaoAuthId, googleAuthId, createdAt, deletedAt
 *
 * 위의 필드를 제외한 나머지는 유저정보로 공개한다.
 */
interface IPublicUserInfo {
  id: string;
  email: string;
  name: string;
  phone: string;
  imgUrl: string;
  fields: string[];
  tendency: string[];
  position: string;
  intro: string;
  skills: string[];
  likes: number;
}

export type PublicUserInfo = Omit<
  IPublicUserInfo,
  'password' | 'kakaoAuthId' | 'googleAuthId' | 'createdAt' | 'deletedAt'
>;
