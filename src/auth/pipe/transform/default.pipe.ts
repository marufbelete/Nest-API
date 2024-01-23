import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
//transfoming input data to the desired form
// validation: evaluate input data and if valid, simply pass it through unchanged; otherwise, throw an exception
export class DefaultPipe implements PipeTransform {
  constructor(private value?: any) {}
  transform(value: any, metadata: ArgumentMetadata) {
    return typeof value === 'undefined' ? this.value : value;
  }
}
