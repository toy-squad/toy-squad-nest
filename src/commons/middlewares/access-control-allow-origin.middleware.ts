import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccessControlAllowOriginMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const allowOriginUrls = [
      this.configService.get('FRONTEND_URL'),
      'http://localhost:3000',
      'https://accounts.google.com',
      'https://accounts.kakao.com',
    ];
    res.setHeader('Access-Control-Allow-Origin', allowOriginUrls);
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  }
}
