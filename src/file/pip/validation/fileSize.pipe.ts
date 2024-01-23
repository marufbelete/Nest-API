import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { fileValidation } from 'src/file/constant/fileValidation.constant';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    if (value.size > fileValidation.fileSize.value) {
      throw new BadRequestException(fileValidation.fileSize.errorMessage);
    }
    return value;
  }
}
