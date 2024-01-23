import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
//transfoming input data to the desired form
// validation: evaluate input data and if valid, simply pass it through unchanged; otherwise, throw an exception
export class DefaultValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === 'undefined') {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
}
