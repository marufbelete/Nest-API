import {
  ArgumentsHost,
  Catch,
  ForbiddenException,
  RequestTimeoutException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { TimeoutError } from 'rxjs';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    console.log(exception);
    console.log("exception")
    if (exception instanceof PrismaClientKnownRequestError) {;
      if (exception.code === 'P2002') {
        super.catch(new ForbiddenException('Credentials taken'), host);
      }
    }
    if (exception instanceof TimeoutError) {
      super.catch(new RequestTimeoutException('Request Takes Too Long'), host);
    }
    return super.catch(exception, host);
  }
}

// @Catch(PrismaClientKnownRequestError)
// export class PrismaExceptionFilter implements ExceptionFilter {
//   catch(exception:PrismaClientKnownRequestError, host: ArgumentsHost) {
//     // Your custom error handling logic goes here
//     console.log(exception.code)
//         if (exception.code === 'P2002') {
//           new ForbiddenException('Credentials taken');
//         }

// console.log("what happen")
//     // return super.catch(exception, host);
//   }
// }

// @Injectable()
// export class NotFoundInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     // next.handle() is an Observable of the controller's result value
//     return next.handle()
//       .pipe(catchError(error => {
//         if (error instanceof EntityNotFoundError) {
//           throw new NotFoundException(error.message);
//         } else {
//           throw error;
//         }
//       }));
//   }
// }
