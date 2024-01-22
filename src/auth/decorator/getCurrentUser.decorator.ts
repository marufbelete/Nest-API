import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { googlePayload, payload } from '../types';

export const GetCurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): payload|googlePayload => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as payload|googlePayload;
    return user;
  },
);
