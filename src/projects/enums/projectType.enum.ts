/**
 * 프로젝트 진행 방식 종류
 * - C  : 대면(Contact)
 * - U  : 비대면(Untact)
 * - M  : 대면/비대면 혼합방식(Mix)
 */
export enum ContactType {
  CONTACT = 'C',
  UNTACT = 'U',
  MIX = 'M',
}

/**
 * 상위 포지션 종류
 * - MANAGER  : 매니저
 * - DEVELOPER  : 개발자
 * - DESIGNER  : 디자이너
 */
export enum FirstPositionType {
  MANAGER = 'MANAGER',
  DEVELOPER = 'DEVELOPER',
  DESIGNER = 'DESIGNER',
}

/**
 * 하위 포지션 종류
 * - SERVICE_MANAGER  : 서비스 기획자
 * - WEB_PLANNER  : 웹 기획자
 * - PROJECT_MANAGER  : 프로젝트 매니저
 * - PROJECT_OWNER  : 프로젝트 오너
 * - GAME_PLANNER  : 게임 기획자
 * - FRONTEND_DEVELOPER  : 웹 프론트엔드 개발자
 * - BACKEND_DEVELOPER  : 웹 백엔드 개발자
 * - FULLSTACK_DEVELOPER  : 웹 풀스택 개발자
 * - ANDROID_DEVELOPER  : 안드로이드 개발자
 * - IOS_DEVELOPER  : IOS 개발자
 * - CROSSPLATFORM_DEVELOPER  : 크로스플랫폼 앱 개발자
 * - GAME_DEVELOPER  : 게임 개발자
 * - DATA_SCIENTIST  : 데이터 사이언티스트
 * - BIGDATA_ENGINEER  : 빅데이터 엔지니어
 * - MACHINE_LEARNING_ENGINEER  : 머신러닝 엔지니어
 * - DEVOPS_ENGINEER  : 데브옵스 엔지니어
 * - WEB_PUBLISHER  : 웹 퍼블리셔
 * - UI_UX_DESIGNER  : UI / UX 디자이너
 * - GUI_DESIGNER  : GUI 디자이너
 * - WEB_DESIGNER  : 웹 디자이너
 * - CHARACTER_DESIGNER  : 캐릭터 디자이너
 * - MOBILE_DESIGNER  : 모바일 디자이너
 * - GRAPHIC_DESIGNER  : 그래픽 디자이너
 * - D_DESIGNER  : 3D 디자이너
 */
export enum SecondPositionType {
  // Manager Positions
  SERVICE_MANAGER = '서비스 기획자',
  WEB_PLANNER = '웹 기획자',
  PROJECT_MANAGER = '프로젝트 매니저',
  PROJECT_OWNER = '프로젝트 오너',
  GAME_PLANNER = '게임 기획자',

  // Developer Positions
  FRONTEND_DEVELOPER = '웹 프론트엔드 개발자',
  BACKEND_DEVELOPER = '웹 백엔드 개발자',
  FULLSTACK_DEVELOPER = '웹 풀스택 개발자',
  ANDROID_DEVELOPER = '안드로이드 개발자',
  IOS_DEVELOPER = 'IOS 개발자',
  CROSSPLATFORM_DEVELOPER = '크로스플랫폼 앱 개발자',
  GAME_DEVELOPER = '게임 개발자',
  DATA_SCIENTIST = '데이터 사이언티스트',
  BIGDATA_ENGINEER = '빅데이터 엔지니어',
  MACHINE_LEARNING_ENGINEER = '머신러닝 엔지니어',
  DEVOPS_ENGINEER = '데브옵스 엔지니어',
  WEB_PUBLISHER = '웹 퍼블리셔',

  // Designer Positions
  UI_UX_DESIGNER = 'UI / UX 디자이너',
  GUI_DESIGNER = 'GUI 디자이너',
  WEB_DESIGNER = '웹 디자이너',
  CHARACTER_DESIGNER = '캐릭터 디자이너',
  MOBILE_DESIGNER = '모바일 디자이너',
  GRAPHIC_DESIGNER = '그래픽 디자이너',
  D_DESIGNER = '3D 디자이너'
}
