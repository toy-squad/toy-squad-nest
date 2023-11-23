import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccessControlAllowOriginMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const originURLs = [
      // FE
      'http://localhost:3000',
      'https://web-toy-squad-client-20zynm2mljtlwyix.sel4.cloudtype.app',
    ];

    // 쿠키 허용
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
      'Content-Type',
      'application/x-www-form-urlencoded;charset=utf-8',
    );
    res.setHeader('Access-Control-Allow-Origin', originURLs);
    // res.header(
    //   'Access-Control-Allow-Headers',
    //   'Origin, X-Requested-With, Content-Type, Accept',
    // );

    next();
  }
}
