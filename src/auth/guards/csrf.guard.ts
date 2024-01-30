// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Request } from 'express';
// import { Observable } from 'rxjs';
// import { AuthService } from '../auth.service';
// import { payload } from '../types';

// @Injectable()
// export class CsrfGuard implements CanActivate {
//     constructor(
//         private authService: AuthService,
//       ) {}
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
    
//     const request:Request = context.switchToHttp().getRequest();
//     if(request.method === 'GET') {
//         return true
//         }
//     return this.validateCsrfToken(request);
//   }
//   async validateCsrfToken(request:Request){
//     const token=request.headers.csrf_token as string;
//     const user=request.user as payload
//     const refresh_token=request.cookies.refresh_token
//     const token_info=await this.authService.tokenExist(user.sub,refresh_token)
//     return this.authService.verifyCsrfToken(token,token_info.csrfSecret)
//   }
// }