import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, timeout } from 'rxjs/operators';
import { Request } from 'express';
export interface CustomResponse<T> {
  data: T;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, CustomResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CustomResponse<T>> {
  
    const request: Request = context.switchToHttp().getRequest();
    //for redirect route
    if (request.url.split('?')[0] === '/auth/google/callback') {
      return next.handle();
    }
    return next.handle().pipe(
      timeout(5000), //time out for every request
      map((data) => {
        return {
          data
        };
      }),
    );
  }
}
