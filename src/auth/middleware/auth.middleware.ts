import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    console.log('in middleware');
    next();
  }
}

// import { Request, Response, NextFunction } from 'express';
// export async function ProductMiddleware(req: Request, res: Response, next:NextFunction) {
//   console.log("in middleware")
//   console.log(req.body)
//   next();
// }
