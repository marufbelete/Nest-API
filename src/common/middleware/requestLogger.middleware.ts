import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(request: Request, response: Response, next: NextFunction): void {
    
    // const isProduction = process.env.NODE_ENV === 'production';
    // if (!isProduction) {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    console.log('fffff')
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });
// }

    next();
  }
}