import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { payload } from '../types';

export const GetCurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): payload => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as payload;
    return user;
  },
);
