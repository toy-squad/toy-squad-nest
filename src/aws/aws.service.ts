import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  s3Client: S3Client;
  AWS_REGION: string;
  AWS_BUCKET_NAME: string;

  constructor(private configService: ConfigService) {
    this.AWS_REGION = this.configService.get('AWS_REGION');
    this.AWS_BUCKET_NAME = this.configService.get('AWS_BUCKET_NAME');

    this.s3Client = new S3Client({
      region: this.AWS_REGION,
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async imageUploadToS3(
    dirName: string,
    fileName: string,
    uploadFile: Express.Multer.File,
    ext: string,
  ) {
    // AWS S3에 이미지 업로드
    const command = new PutObjectCommand({
      Bucket: this.AWS_BUCKET_NAME, // 저장할 S3 버킷
      Key: `${dirName}/${fileName}`, // 업로드될 파일 이름
      Body: uploadFile.buffer, // 업로드할 파일
      ContentType: `image/${ext}`, // 파일타입
    });

    // 생성된 명령을 S3 클라이언트에 전달하여 이미지업로드를 수행한다
    await this.s3Client.send(command);

    // 업로드된 이미지 URL을 반환
    return `https://s3.${this.AWS_REGION}.amazonaws.com/${this.AWS_BUCKET_NAME}/${dirName}/${fileName}`;
  }
}
