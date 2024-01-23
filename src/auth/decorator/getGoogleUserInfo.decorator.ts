import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { googlePayload} from '../types';

export const GetGoogleUserInfo = createParamDecorator(
  (data: unknown, context: ExecutionContext): googlePayload => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as googlePayload;
    return user;
  },
);
