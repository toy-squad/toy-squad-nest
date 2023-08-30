import { Request } from 'express';
import TokenPayload from './token-payload.interface';

interface RequestWithUser extends Request {
  user: TokenPayload;
}

export default RequestWithUser;
