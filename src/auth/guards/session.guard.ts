import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorator';

@Injectable()
export class IsAuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {

    console.log("from session guard user");
    console.log(context.getType()==='ws');
    if(context.getType()==='ws') return false
    console.log("from session guard user");
    return true
  }
}
