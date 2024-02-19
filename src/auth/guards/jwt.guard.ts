import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorator';
import { Request, Response } from 'express';
import { AuthService } from '../auth.service';
import { payload } from '../types';
import { RefreshToken } from '@prisma/client';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private authService: AuthService) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
 
    if (isPublic) return true;
    //verifying the authenticity of the JWT token
    // return super.canActivate(context);
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const { refresh_token, access_token } = request?.cookies;
    console.log(request.cookies.refresh_token);
    if (!access_token) throw new UnauthorizedException('Unauthorized user');
    try {
      this.authService.validateToken(
        access_token,
        this.authService.ACCESS_TOKEN_SECRET,
      );
      return this.activate(context);
    } catch (error) {
      if (error.name === 'TokenExpiredError' && error.expiredAt !== undefined) {
        console.log('inside TokenExpiredError');
        if (!refresh_token) {
          this.clearAllCookies(response);
          throw new UnauthorizedException('Unauthorized user');
        }
        let refresh_token_db: RefreshToken;
        let user: payload;
        try {
          const { email, sub }: payload = this.authService.validateToken(
            refresh_token,
            this.authService.REFRESH_TOKEN_SECRET,
          );
          user = { email, sub };
          refresh_token_db = await this.authService.tokenExist(
            sub,
            refresh_token,
          );
          console.log(refresh_token_db);
        } catch (error) {
          console.log(error);
          this.clearAllCookies(response);
          throw new UnauthorizedException('Unauthorized user');
        }
        //is it exist in database
        if (!refresh_token_db) {
          //remove from db and log out from all devices
          await this.authService.removeToken({
            userId: user.sub,
          });
          this.clearAllCookies(response);
          throw new UnauthorizedException(
            'Security breach detected! We have logged you out from all devices please login again',
          );
        }
        //renew both token for that user
        const new_access_token = await this.authService.generateToken(
          user,
          this.authService.ACCESS_TOKEN_SECRET,
          this.authService.ACCESS_TOKEN_EXPIRY,
        );

        const new_refresh_token = await this.authService.generateToken(
          user,
          this.authService.REFRESH_TOKEN_SECRET,
          this.authService.REFRESH_TOKEN_EXPIRY,
        );

        await this.authService.upsertToken(
          refresh_token,
          new_refresh_token,
          user.sub,
        );
        this.authService.setCookie('access_token', new_access_token, response);
        this.authService.setCookie(
          'refresh_token',
          new_refresh_token,
          response,
        );
        request.cookies.access_token = new_access_token;
        return this.activate(context);
      }
      this.clearAllCookies(response);
      throw new UnauthorizedException('Unauthorized user');
    }
  }
  async activate(context: ExecutionContext): Promise<boolean> {
    //this also verify for token built in for passport
    return super.canActivate(context) as Promise<boolean>;
  }
  clearAllCookies(response: Response) {
    this.authService.clearCookie('access_token', response);
    this.authService.clearCookie('refresh_token', response);
    return;
  }
}
