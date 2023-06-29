import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { POSITION } from './types/position.type';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { FindUserRequestDto } from './dtos/find-one-user-request.dto';
import { ConfirmPasswordRequestDto } from './dtos/confirm-password-request.dto';
import { FindUserListRequestDto } from './dtos/find-user-list-request.dto';

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
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async createUser(dto: CreateUserRequestDto) {
    try {
      const { positionCategory, position, password, email } = dto;

      // 이미 존재하는 아이디인지 확인
      const user = await this.usersRepository.findOneUser({
        email: email,
      });

      if (user) {
        throw new BadRequestException('이미 존재하는 유저입니다.');
      }

      // 비밀번호 암호화
      const hashedPassword = await bcrypt.hash(password, 10);

      // 포지션 유효성 검사
      const checkAvailablePosition = await this.checkAllowedDetailPosition(
        position,
        positionCategory,
      );

      if (!checkAvailablePosition) {
        throw new BadRequestException('존재하지 않은 포지션 입니다');
      }

      const newUser = this.usersRepository.createNewUser({
        ...dto,
        password: hashedPassword,
      });
      return newUser;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  /**
   * 단일 유저 검색
   */
  async findOneUser(dto: FindUserRequestDto) {
    return await this.usersRepository.findOneUser(dto);
  }

  /**
   *
   * 유저리스트 검색
   */
  async findUserList(dto: FindUserListRequestDto) {
    return await this.usersRepository.findUserList(dto);
  }

  /**
   * 유저 삭제
   * - softDelete로 유저삭제: DeleteDateColumn 값이 YYYY-mm-dd UTC 형식
   */
  async deleteUser(userId: string) {
    return await this.usersRepository.softDeleteUser(userId);
  }

  /**
   * 비밀번호 확인
   * - 회원탈퇴 할때
   * - 로그인 할때
   * - 유저정보 수정할때
   */
  private async confirmPassword(dto: ConfirmPasswordRequestDto) {
    try {
      // email에 해당하는 계정정보를 불러온다.
      const { email, plainTextPassword } = dto;
      const userInfo = await this.usersRepository.findOneUser({ email: email });

      const isMatched = await bcrypt.compare(
        plainTextPassword,
        userInfo.password,
      );

      if (!isMatched) {
        throw new BadRequestException('이메일과 비밀번호가 올바르지 않습니다.');
      }

      return;
    } catch (error) {
      throw error;
    }
  }
}
