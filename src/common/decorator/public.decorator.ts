import { SetMetadata } from '@nestjs/common';

export const Public=(type='access_token')=>SetMetadata(type,true)