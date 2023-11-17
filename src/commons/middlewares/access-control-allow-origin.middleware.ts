import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccessControlAllowOriginMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const frontendUrl = this.configService.get('FRONTEND_URL');
    res.setHeader('Access-Control-Allow-Origin', frontendUrl);
    next();
  }
}
