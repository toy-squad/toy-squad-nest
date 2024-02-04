export class imageUploadToS3Dto {
  dirName: string;
  fileName: string;
  uploadFile: Express.Multer.File;
  ext: string;
}

export class deleteImageFromS3Dto {
  // s3 imgUrl = https://s3.${this.AWS_REGION}.amazonaws.com/${this.AWS_BUCKET_NAME}/${dirName}/${fileName}
  // key = ${dirName}/${fileName}
  key: string;
}
