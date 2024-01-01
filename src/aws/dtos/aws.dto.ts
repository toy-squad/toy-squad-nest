export class imageUploadToS3Dto {
  dirName: string;
  fileName: string;
  uploadFile: Express.Multer.File;
  ext: string;
}
