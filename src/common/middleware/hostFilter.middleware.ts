import { ForbiddenException, Injectable, NestMiddleware} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HostFilterMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
      const expectedHost = 'http://localhost:3011';
      const requestHost = request.hostname;
      console.log(requestHost)
      //referer and host

      if (requestHost !== expectedHost) {
        throw new ForbiddenException('Forbidden host'); // You can customize the error response
      }

      next();
    
  }
}
