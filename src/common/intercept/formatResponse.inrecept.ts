import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, timeout } from 'rxjs/operators';
import { Request } from 'express';
export interface CustomFormattedResponse<T> {
  data: T;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, CustomFormattedResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CustomFormattedResponse<T>> {
  
    const request: Request = context.switchToHttp().getRequest();
    //for redirect route //webhook
    if (request.url.split('?')[0] === '/auth/google/callback') {
      return next.handle();
    }
    return next.handle().pipe(
      timeout(7000), //time out for every request
      map((data) => {
        return {
          data
        };
      }),
    );
  }
}
