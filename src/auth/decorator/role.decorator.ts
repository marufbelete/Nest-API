import { SetMetadata } from '@nestjs/common';
export enum Role {
  User = 'user',
  Admin = 'admin',
}
export const ROLES_KEY = 'roles';
export const RolesAccess = (roles: Role[]) => SetMetadata(ROLES_KEY, roles);
