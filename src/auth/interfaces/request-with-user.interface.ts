import { Request } from 'express';
import { PublicUserInfo } from 'users/types/public-user-info.type';

interface RequestWithUser extends Request {
  user: PublicUserInfo;
}

export default RequestWithUser;
