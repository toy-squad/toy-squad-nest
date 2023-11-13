/**
 * 프로젝트 진행 방식 종류
 * - C  : 대면(Contact)
 * - U  : 비대면(Untact)
 * - M  : 대면/비대면 혼합방식(Mix)
 */
export enum contactType {
  CONTACT = 'C',
  UNTACT = 'U',
  MIX = 'M',
}

/**
 * 포지션 종류
 * - MANAGER  : 매니저
 * - DEVELOPER  : 개발자
 * - DESIGNER  : 디자이너
 */
export enum firstPosition {
  MANAGER = 'MANAGER',
  DEVELOPER = 'DEVELOPER',
  DESIGNER = 'DESIGNER',
}