import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from '../decorator/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log(requiredRoles);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    console.log(user);
    return requiredRoles.some((role) => user?.roles?.includes(role));
  }
}

// import { ExecutionContext, Injectable } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { AuthGuard } from '@nestjs/passport';
// import { IS_PUBLIC_KEY } from '../decorator';

// @Injectable()
// export class JwtGuard extends AuthGuard('jwt'){
//     constructor(private reflector: Reflector){
//         super()
//     }
//     canActivate(context: ExecutionContext) {
//         const isPublic = this.reflector.
//         getAllAndOverride(IS_PUBLIC_KEY, [
//           context.getHandler(),
//           context.getClass(),
//         ]);
//         if (isPublic) return true;
//         return super.canActivate(context);

//   }
// }
