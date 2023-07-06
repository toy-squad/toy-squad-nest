import { Users } from 'users/entities/user.entity';

type OptionalColumnKeys =
  | 'password'
  | 'name'
  | 'phone'
  | 'imgUrl'
  | 'tendency'
  | 'skills'
  | 'fields'
  | 'position'
  | 'intro';
/**
 * UpdatedUserInfoRequestDto 에 들어있는 컬럼만을 추출한다.
 *
 * - userId를 제외한 나머지 컬럼이 해당한다.
 * - userId를 제외한 나머지 컬럼이 undefined일 경우, 기존값으로 매핑하기 위해서이다.
 * - positionCategory 는 Users.entity에 존재하는 컬럼이 아니므로 제외한다.
 */
export type UpdatedUserInfoType = Pick<Users, OptionalColumnKeys>;
