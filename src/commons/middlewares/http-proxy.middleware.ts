import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Injectable()
export class HttpProxyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
    });
    next();
  }
}
