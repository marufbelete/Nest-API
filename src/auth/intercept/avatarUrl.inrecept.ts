import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { switchMap, } from 'rxjs/operators';
import { FileService } from 'src/file/file.service';
import { UserResponseDto } from '../dtos';

@Injectable()
export class AvatarUrlResponseInterceptor<T> implements NestInterceptor {
  constructor(private fileService: FileService) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    // console.log('loal inter 0');
    return next.handle().pipe(
      switchMap(async (data:UserResponseDto) => {
        // console.log('loal inter');
        if (data.avatar) {
          const url = await this.fileService.fileRetrive(data.avatar);
          data.url = url;
        }
        return data;
      }),
    );
  }
}
