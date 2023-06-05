import { Injectable, Logger } from '@nestjs/common';
import { POSITION, PrePositions } from './types/position.type';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  async getDetailPositions(prePosition: string) {
    const isAvailablePosition = PrePositions.includes(prePosition);
    if (isAvailablePosition) {
      return POSITION[prePosition];
    }
  }
}
