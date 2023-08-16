import { Request } from 'express';
import { PublicUserInfo } from 'users/types/public-user-info.type';

export interface RequestWithUser extends Request {
  user: PublicUserInfo;
}
