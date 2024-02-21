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
import { UpdateUserInfoServiceDto } from './dtos/requests/update-user-info-request.dto';
import { UpdatedUserInfoType } from './types/update-user-info.type';
import { UpdatePasswordRequestDto } from 'users/dtos/requests/update-password-request.dto';
import { AwsService } from 'aws/aws.service';
import { RedisService } from 'redis/redis.service';
import {
  getImageFileTypeFromMimeType,
  getKeyFromS3Url,
} from 'commons/constants/FILE_CONSTANT';
import { UpdateLikeUserServiceRequestDto } from './dtos/requests/update-like-user-request.dto';
import { LikesRepository } from 'likes/likes.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  static readonly positionCategory = ['DEVELOPER', 'DESIGNER', 'MANAGER'];

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly likesRepository: LikesRepository,
    private readonly awsService: AwsService,
    private readonly redisService: RedisService,
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
      if (position && position_category) {
        const checkAvailablePosition = await this.checkAllowedDetailPosition(
          position,
          position_category,
        );

        if (!checkAvailablePosition) {
          throw new BadRequestException('존재하지 않은 포지션 입니다');
        }
      }

      const newUser = await this.usersRepository.createNewUser({
        ...dto,
        password: hashedPassword,
      });

      // 새로운 유저 생성했을 때, 중요정보를 리턴하지 않도록 한다.
      const newUserPublicInfo = await this.findOneUser({
        userId: newUser.id,
        allowPassword: false,
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
   * - 유저 비밀번호 수정
   * - 유저 프로필 이미지 업로드
   * - 유저 엔티티 필드 수정
   */
  async updateUserInfo(dto: UpdateUserInfoServiceDto) {
    try {
      const { userId, imgProfileFile, ...userInfo } = dto;

      // userId 를 갖는 유저가 존재하는지 확인
      const defaultUserInfo: UpdatedUserInfoType =
        await this.usersRepository.findOneUser({
          userId: userId,
        });
      if (!defaultUserInfo) {
        throw new NotFoundException('존재하지 않은 회원입니다.');
      }

      // 비밀번호 패스워드 수정할 경우 - 새로운 비밀번호를 암호화한다.
      const password = dto.password
        ? await bcrypt.hash(dto.password, 10)
        : undefined;

      let imgUrl: string;
      if (imgProfileFile) {
        // 데이터베이스에 저장된 유저정보의 이미지 필드가 존재한다면, 해당이미지를 s3에서 제거한다.
        if (defaultUserInfo.imgUrl) {
          const key = getKeyFromS3Url(defaultUserInfo.imgUrl);
          await this.awsService.deleteImageFromS3({ key: key });
        }

        // 업로드한 이미지 확장자를 구한다.
        const mimetype = getImageFileTypeFromMimeType(imgProfileFile.mimetype);

        // 이미지 프로필파일은 s3에 저장한다
        imgUrl = await this.awsService.imageUploadToS3({
          dirName: `users/${userId}/profile`,
          fileName: `profile-img-${userId}.${mimetype}`,
          uploadFile: imgProfileFile,
          ext: imgProfileFile.mimetype,
        });

        if (!imgUrl) {
          throw new BadRequestException('이미지 URL이 존재하지 않습니다.');
        }
      }

      await this.usersRepository.updateUserInfo({
        ...userInfo,
        userId: userId,
        imgUrl: imgUrl,
        password: password,
      });

      // 더이상 비밀번호 변경 못하도록 reset-pwd-{user_id} 토큰값을 지운다.
      if (password) {
        await this.redisService.del(`reset-pwd-${userId}`);
      }

      // 업데이트시킨 유저정보를 구한다.
      const updatedUserInfo = await this.usersRepository.findOneUser({
        userId: userId,
        allowPassword: false,
      });

      return updatedUserInfo;
    } catch (error) {
      return error;
    }
  }

  // 비밀번호 재설정
  async updatePassword(dto: UpdatePasswordRequestDto) {
    try {
      // 비밀번호 재설정
      await this.usersRepository.updateUserInfo(dto);
    } catch (error) {
      return error;
    }
  }

  // 기본이미지로 전환하기
  async updatedDefaultProfileImage(userId: string) {
    try {
      // userId 를 갖는 유저가 존재하는지 확인
      const defaultUserInfo: UpdatedUserInfoType =
        await this.usersRepository.findOneUser({
          userId: userId,
        });
      if (!defaultUserInfo) {
        throw new NotFoundException('존재하지 않은 회원입니다.');
      }

      // 유저가 존재한다면 -> db에 저장된 imgUrl필드를 null로 변경한다.
      await this.usersRepository.updatedDefaultProfileImage(userId);

      // s3 버킷에 있는 데이터를 삭제한다.
      const targetKey = getKeyFromS3Url(defaultUserInfo.imgUrl);
      await this.awsService.deleteImageFromS3({
        key: targetKey,
      });
    } catch (error) {
      return error;
    }
  }

  // FIXME
  // 좋아요 : 좋아요는 딱 한번만 가능.
  async updateLikeUser(dto: UpdateLikeUserServiceRequestDto) {
    const { to, from, likeType } = dto;
    try {
      // 유저를 찾는다.
      // target 유저에 대한 likes 정보를 갖고온다.
      const targetUser = await this.findOneUser({
        userId: to,
      });
      if (!targetUser) {
        throw new NotFoundException('존재하지 않은 회원입니다.');
      }

      // likes 테이블에 복합키 from, to 에 매핑되는 값이 존재하는지 확인
      const likesHistory = await this.likesRepository.findOneLikesHistory({
        from: from,
        to: to,
      });

      if (likeType === 'LIKE') {
        if (likesHistory) {
          throw new BadRequestException(
            '한번만 좋아요 를 반영할 수 있습니다 : 이미 Likes 테이블에 등록되었습니다.',
          );
        }
        await this.likesRepository.addLikesHistory({ from: from, to: to });
      } else {
        if (!likesHistory) {
          throw new BadRequestException(
            '좋아요 취소를 할 수 없습니다 : likes 테이블에 데이터가 존재하지 않습니다.',
          );
        }
        await this.likesRepository.cancelLikesHistory({ from: from, to: to });
      }

      // 좋아요 / 좋아요 취소 반영
      await this.updateUserInfo({
        userId: to,
        likes:
          likeType === 'LIKE' ? targetUser.likes + 1 : targetUser.likes - 1,
      });
    } catch (error) {
      return error;
    }
  }
}
