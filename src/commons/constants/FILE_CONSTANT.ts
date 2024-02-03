export const UPLOAD_IMAGE_MAX_SIZE = 1024 * 1024 * 10; // 10MB
export const VALID_IMAGE_FILE_TYPES_REGEX = /^image\/(jpg|jpeg|png|gif)$/;

// mimeType 초기값 image/jpg|jpeg|png|gif  => jpg|jpeg|png|gif 로 변환한다.
export const getImageFileTypeFromMimeType = (inputImageMimeType: string) => {
  return inputImageMimeType.replace('image/', '');
};

// s3 imgUrl = https://s3.${this.AWS_REGION}.amazonaws.com/${this.AWS_BUCKET_NAME}/${dirName}/${fileName}
// key (${dirName}/${fileName}) 를 파싱한다.
export const getKeyFromS3Url = (inputS3ImageUrl: string) => {
  return inputS3ImageUrl.replace(
    `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_BUCKET_NAME}/`,
    '',
  );
};
