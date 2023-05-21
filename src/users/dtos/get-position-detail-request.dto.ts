import {} from 'class-validator';
import { PrePosition } from '../types/position.type';

export class GetPositionDetailRequestDto {
  // 클라이언트단에서  position은 3가지 (개발자/ 기획자/ 디자이너) 중 한개로 선택을 받는다.
  // 서비스 로직에서 선택한 position에 따라 세부포지션을 리턴한다.
  prePosition: PrePosition;
}
