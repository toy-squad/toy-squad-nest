import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AccessControlAllowOriginMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const allowOriginUrls = [
      'http://localhost:3000',
      'https://accounts.google.com',
      'https://accounts.kakao.com',
    ];
    res.setHeader('Access-Control-Allow-Origin', allowOriginUrls);
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    next();
  }
}
