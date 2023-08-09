import { SetMetadata } from '@nestjs/common';

/**
 * Public() 데코레이터
 * - Public 데코레이터를 만나게되면 guard에서 항상 true를 리턴하도록 한다.
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
