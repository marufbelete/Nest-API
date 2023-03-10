import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt-access'){
    constructor(private reflector: Reflector){
        super()
    }
    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.
        getAllAndOverride('access_token', [
          context.getHandler(),
          context.getClass(),
        ]);
        if (isPublic) 
            return true;
        return super.canActivate(context);
      }
}