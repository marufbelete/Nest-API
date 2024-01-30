// import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { PassportStrategy } from "@nestjs/passport";
// import { Request } from "express";
// import { ExtractJwt, Strategy } from "passport-jwt";
// import { PrismaService } from "../../prisma/prisma.service";
// import { payload } from "../types";
// @Injectable()
// export class RefreshTokenStrategy extends PassportStrategy(Strategy,'refresh'){
//     constructor(
//       config:ConfigService,
//       private prisma:PrismaService
//       ){
//         super({ 
//         jwtFromRequest: ExtractJwt.fromExtractors([
//                RefreshTokenStrategy.extractJWTFromCookie
//               ]),
//         secretOrKey: config.get<string>('REFRESH_TOKEN_SECRET'),
//         passReqToCallback:true,
//     })
//     }
    
//     private static extractJWTFromCookie(req: Request): string | null {
//       if (req.cookies && req.cookies.refresh_token) {
//         return req.cookies.refresh_token;
//       }
//       return null;
//     }

//     async validate(req:Request,payload:payload){
//       console.log("in refresh token")
//         const refresh_token=req.cookies.refresh_token
//         const token=await this.prisma.refreshToken.findFirst({where:
//         {hashedRt:refresh_token,userId:payload.sub}})

//         if(!token||token.blacklist)
//         {
//           await this.prisma.refreshToken.deleteMany({
//             where:{userId:payload.sub}
//           })
//           throw new HttpException("Token compromised, please login again",HttpStatus.FORBIDDEN)
//         }
//         return payload
//     }
    
// }