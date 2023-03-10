import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { payload } from "../types";
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy,'jwt-refresh'){
    constructor(
      config:ConfigService,
      private prisma:PrismaService
      ){
        super({ 
        jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => {
                  if (req && req.cookies) {
                    return req.cookies.refresh_token;
                  }
                  return null;
                },
              ]),
        secretOrKey: config.get<string>('REFRESH_TOKEN_SECRET'),
        passReqToCallback:true
    })
    }

    async validate(req:Request,payload:payload){
    const refresh_token=req.cookies.refresh_token
    const user=await this.prisma.user.findFirst({where:
    {hashedRt:refresh_token}})
    if(refresh_token!==user?.hashedRt)
    {
      await this.prisma.user.updateMany({
        where:{id:payload.sub},
        data:{hashedRt:null}
      })
      throw new HttpException("Token compromised, please login again",HttpStatus.FORBIDDEN)
    }
    return payload
    }
    
}