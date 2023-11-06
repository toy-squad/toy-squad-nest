/**
 * 비밀번호 재설정 여부를 확인가능
 * - 1. [이메일] 비밀번호 재설정 버튼 클릭시 -> [토이스쿼드][서버 API 호출] 토큰 검증 및 만료여부확인 -> [토이스쿼드] 토큰이 만료되지 않으면 비밀번호 재설정 UI로 리다이렉션
 * - 2. [토이스쿼드][비밀번호 재설정 API호출] -> 토큰검증 및 만료여부 + 비밀번호 올바른포맷인지, 확인입력과 일치한지 확인 -> [토이스쿼드] 비밀번호 수정
 * 위 2개 API의 경우에는 PasswordResetTokenAvailableMiddleware 을 거쳐야함.
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class PasswordResetTokenAvailableMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    next();
  }
}
