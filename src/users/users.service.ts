import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserRequestDto } from './dtos/requests/create-user-request.dto';
import { POSITION } from './types/position.type';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { FindUserRequestDto } from './dtos/requests/find-one-user-request.dto';
import { ConfirmPasswordRequestDto } from './dtos/requests/confirm-password-request.dto';
import { FindUserListRequestDto } from './dtos/requests/find-user-list-request.dto';
import { GetUserDetailRequestDto } from './dtos/requests/get-user-detail-request.dto';
import { UpdateUserInfoRequestDto } from './dtos/requests/update-user-info-request.dto';
import { UpdatedUserInfoType } from './types/update-user-info.type';
import { UpdatePasswordRequestDto } from 'users/dtos/requests/update-password-request.dto';
import { AwsService } from 'aws/aws.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  static readonly positionCategory = ['DEVELOPER', 'DESIGNER', 'MANAGER'];

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly awsService: AwsService,
  ) {}

  /**
   * 카테고리에 매핑되는 포지션 조회
   */
  async getDetailPositions(positionCategory: string): Promise<string[]> {
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
      const { position_category, position, password, email } = dto;

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
        position_category,
      );

      if (!checkAvailablePosition) {
        throw new BadRequestException('존재하지 않은 포지션 입니다');
      }

      const newUser = await this.usersRepository.createNewUser({
        ...dto,
        password: hashedPassword,
      });

      // 새로운 유저 생성했을 때, 중요정보를 리턴하지 않도록 한다.
      const newUserPublicInfo = await this.findOneUser({
        userId: newUser.id,
      });
      return newUserPublicInfo;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  /**
   * 단일 유저 검색
   */
  async findOneUser(dto: FindUserRequestDto) {
    const user = await this.usersRepository.findOneUser(dto);
    return user;
  }

  /**
   *
   * 유저리스트 검색
   *
   * 검색조건
   * - 이메일
   * - 이름
   * - 포지션
   * - 스킬
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
   * 1) 인자정보
   * - 첫번째인자: plainTextPassword  / 입력 비밀번호
   * - 두번째인자: savedPassword      / DB에 저장된 비밀번호
   *
   * 2) 사용
   * - 로그인 할때
   * - 회원탈퇴 할때
   * - 유저정보 수정할때
   */
  async confirmPassword(dto: ConfirmPasswordRequestDto) {
    try {
      // email에 해당하는 계정정보를 불러온다.
      const { email, plainTextPassword } = dto;
      const userInfo = await this.usersRepository.findOneUser({
        email: email,
        allowPassword: true,
      });

      if (!userInfo) {
        throw new NotFoundException('유저가 존재하지 않습니다.');
      }

      const isMatched = await bcrypt.compare(
        plainTextPassword,
        userInfo.password,
      );

      if (!isMatched) {
        throw new BadRequestException('이메일과 비밀번호가 올바르지 않습니다.');
      }

      return isMatched;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 유저정보수정
   * - dto: 정보수정 요청 데이터
   * - defaultUserInfo: 기존 DB에 저장된 유저정보
   */
  async updateUserInfo(dto: UpdateUserInfoRequestDto) {
    try {
      const { userId, imgProfileFile } = dto;

      // userId 를 갖는 유저가 존재하는지 확인
      const defaultUserInfo: UpdatedUserInfoType =
        await this.usersRepository.findOneUser({
          userId: userId,
        });
      if (!defaultUserInfo) {
        throw new NotFoundException('존재하지 않은 회원입니다.');
      }

      // 이미지 프로필파일은 s3에 저장한다
      if (imgProfileFile) {
      }
      await this.usersRepository.updateUserInfo(dto);
    } catch (error) {
      throw error;
    }
  }

  // 비밀번호 재설정
  async updatePassword(dto: UpdatePasswordRequestDto) {
    try {
      // 비밀번호 재설정
      await this.usersRepository.updateUserInfo(dto);
    } catch (error) {
      throw error;
    }
  }
}
