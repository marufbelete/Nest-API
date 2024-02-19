import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from '../decorator/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log("user");
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log(requiredRoles);
    if (!requiredRoles||(requiredRoles.length==0)) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    console.log(user);
    return requiredRoles.some((role) => user?.roles?.includes(role));
  }
}
