import { ForbiddenException, Injectable, NestMiddleware} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as CsrfTokens from 'csrf';
import { payload } from 'src/auth/types';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  //for all non-GET requests
  use(request: Request, response: Response, next: NextFunction) {
    const tokens = new CsrfTokens();
    const secret=request.cookies._csrf ;
    const token=request.headers['csrf-token'] as string;
// console.log(token)
// console.log(request.cookies)
console.log('first')
console.log(request.url)
    if (!tokens.verify(secret, token)) {
      throw new ForbiddenException("Invalid csrf token")
    }
    next();
    
  }
}
