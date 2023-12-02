// 개발자/기획자/디자이너 중 하나 선택

/**
 * DEVELOPER: 개발자
 * DESIGNER: 디자이너
 * MANAGER: 기획자
 */
export type positionCategory = 'DEVELOPER' | 'DESIGNER' | 'MANAGER';

// 세부포지션
// map[key:positionCategory] = []
export const POSITION = {
  MANAGER: [
    '서비스 기획자',
    '웹 기획자',
    '프로젝트 매니저',
    '프로젝트 오너',
    '게임 기획자',
  ],
  DEVELOPER: [
    '웹 프론트엔드 개발자',
    '웹 백엔드 개발자',
    '웹 풀스택 개발자',
    '안드로이드 개발자',
    'IOS 개발자',
    '크로스플랫폼 앱 개발자',
    '게임 개발자',
    '데이터 사이언티스트',
    '빅데이터 엔지니어',
    '머신러닝 엔지니어',
    '데브옵스 엔지니어',
    '웹 퍼블리셔',
  ],
  DESIGNER: [
    'UI / UX 디자이너',
    'GUI 디자이너',
    '웹 디자이너',
    '캐릭터 디자이너',
    '모바일 디자이너',
    '그래픽 디자이너',
    '3D 디자이너',
  ],
};
