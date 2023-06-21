import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { POSITION } from './types/position.type';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  static readonly positionCategory = ['DEVELOPER', 'DESIGNER', 'MANAGER'];

  constructor(private readonly usersRepository: UsersRepository) {}

  /**
   * 카테고리에 매핑되는 포지션 조회
   */
  async getDetailPositions(positionCategory: string) {
    // 선택한 포지션 카테고리
    const category = positionCategory.toUpperCase();

    // positionCategory 리스트에 있는 카테고리인지 확인
    const isAvailableCategory =
      UsersService.positionCategory.includes(category);
    if (!isAvailableCategory) {
      throw new BadRequestException('존재하지 않은 포지션 카테고리 입니다.');
    }

    const detailPositionList = POSITION[category];
    return detailPositionList;
  }

  /**
   * 올바른 카테고리인지 확인
   * 올바른 포지션인지 확인
   */
  private async checkAllowedDetailPosition(position: string, category: string) {
    try {
      // 포지션리스트를 찾는다.
      const detailPositionList = await this.getDetailPositions(category);

      // positionCategory[category] 에 해당하는 포지션인지 확인
      // 입력포지션이 포지션리스트에 포함되어 있는지 확인
      return detailPositionList.includes(position);
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  }

  async createUser(dto: CreateUserRequestDto) {
    try {
      const { positionCategory, position } = dto;

      // 이미 존재하는 아이디인지 확인
      const { email } = dto;
      const checkExistUser = this.usersRepository.findUser({
        email: dto.email,
      });

      // 비밀번호 암호화

      // 포지션 유효성 검사
      const checkAvailablePosition = await this.checkAllowedDetailPosition(
        position,
        positionCategory,
      );

      if (!checkAvailablePosition) {
        throw new BadRequestException('존재하지 않은 포지션 입니다');
      }

      const newUser = this.usersRepository.createNewUser(dto);
      return newUser;
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }
}
