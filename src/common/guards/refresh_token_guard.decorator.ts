
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh'){
    constructor(private reflector: Reflector){
        super()
    }
    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.
        getAllAndOverride('refresh_token', [
          context.getHandler(),
          context.getClass(),
        ]);
        if (isPublic) 
            return true;
        return super.canActivate(context);
      }
}