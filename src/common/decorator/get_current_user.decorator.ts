import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { payload } from 'src/auth/types';

export const GetCurrentUser = createParamDecorator(
  (_: undefined, context: ExecutionContext): payload => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as payload;
    return user;
  });