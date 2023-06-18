import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { POSITION } from './types/position.type';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  static readonly prePositions = ['DEVELOPER', 'DESIGNER', 'MANAGER'];

  async getDetailPositions(positionCategory: string) {
    this.logger.log(`pre-position::::: ${positionCategory}`);

    // 선택한 포지션 카테고리
    const category = positionCategory.toUpperCase();
    const position = UsersService.prePositions.includes(category);
    if (!position) {
      throw new BadRequestException('존재하지 않은 포지션 입니다.');
    }

    const detailPosition = POSITION[category];
    return detailPosition;
  }

  async createUser(dto: CreateUserRequestDto) {
    try {
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }
}
