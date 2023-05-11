import { SetMetadata } from '@nestjs/common';

export const TYPEORM_EX_REPO = 'TYPEORM_EX_REPO';

export function CustomRepository(entity: Function): ClassDecorator {
  return SetMetadata(TYPEORM_EX_REPO, entity);
}
