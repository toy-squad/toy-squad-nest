import { Injectable, PipeTransform } from '@nestjs/common';

const VALID_IMAGE_FILE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
];

@Injectable()
export class ImageFileValidationPipe implements PipeTransform {
  async transform(inputFile: Express.Multer.File) {
    const { mimeType } = await fromBuffer(inputFile.buffer);
  }
}
