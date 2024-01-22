import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
//transfoming input data to the desired form
// validation: evaluate input data and if valid, simply pass it through unchanged; otherwise, throw an exception
export class DefaultPipe<T = any> implements PipeTransform {
  constructor(private value?: T) {}
  transform(value: any, metadata: ArgumentMetadata): T {
    // console.log(this.value)
    console.log(value);
    return this.value;
  }
}
