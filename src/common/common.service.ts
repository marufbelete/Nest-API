import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { payload } from 'src/auth/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommonService {
constructor(  
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    ){}
    readonly ACCESS_TOKEN_SECRET = this.configService.get<string>(
        'ACCESS_TOKEN_SECRET',
      );
      readonly ACCESS_TOKEN_EXPIRY = this.configService.get<string>(
        'ACCESS_TOKEN_EXPIRY',
      );
      readonly REFRESH_TOKEN_SECRET = this.configService.get<string>(
        'REFRESH_TOKEN_SECRET',
      );
      readonly REFRESH_TOKEN_EXPIRY = this.configService.get<string>(
        'REFRESH_TOKEN_EXPIRY',
      );

validateToken(token: string, secret: string) {
    return this.jwtService.verify(token, { secret });
  }

async fetchUserRooms(userId:string){
  console.log(userId)
    return await this.prisma.room.findMany({
         where:{
             users:{
                 some:{
                   user:{id:userId}
                 }
             }
         }
     })
 }

async generateToken(payload: payload, secret: string, expiry: string) {
return this.jwtService.signAsync(payload, {
    expiresIn: expiry,
    secret: secret,
});
}
    
}
