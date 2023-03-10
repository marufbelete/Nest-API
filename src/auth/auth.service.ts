import { ForbiddenException, Injectable, HttpStatus} from '@nestjs/common';
import { HttpException } from "@nestjs/common/exceptions";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { signInDto,signUpDto} from './dtos';
import { hash,verify } from 'argon2';
import { payload } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
      private prisma:PrismaService,
      private jwtService:JwtService,
      private configService:ConfigService
      ){}

    async signUp(dto:signUpDto){
      try {
        const hasedPassword=await hash(dto.password)
        const user = await this.prisma.user
        .create({
          data: {
           name:dto.name,
           email:dto.email,
           password:hasedPassword
          }
        })
        return user
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError){
          if (error.code === 'P2002') {
            throw new ForbiddenException('Credentials taken');
          }
        }
        throw error;
      }
    }
async signIn(dto:signInDto,res:Response){

  const user=await this.getUserByEmail(dto.email)
  const passwordMatch=await this.isPasswordMatch(user.password,dto.password)
  if(!passwordMatch){
    throw new HttpException("Invalid credential",HttpStatus.BAD_REQUEST)
  }
  const payload={email:user.email,sub:user.id}
  const access_token=await this.generateToken(payload,
    this.configService.get<string>('ACCESS_TOKEN_SECRET'),
    this.configService.get<string>('ACCESS_TOKEN_EXPIRY'))
  const refresh_token=await this.generateToken(payload,
    this.configService.get<string>('REFRESH_TOKEN_SECRET'),
    this.configService.get<string>('REFRESH_TOKEN_EXPIRY'))
   
   await this.prisma.user.update({
    where:{email:user.email},
    data:{hashedRt:refresh_token}
   })
   res.cookie('access_token',access_token,{httpOnly:true})
   res.cookie('refresh_token',refresh_token,{httpOnly:true})
   return {access_token,refresh_token}


}

async refreshToken(payload:payload,tokenHash:string,res:Response){

  const token_exist=await this.tokenExist(payload.sub,tokenHash)
  if(!token_exist){
    await this.removeToken(payload.sub)
    throw new HttpException("Token compromised",HttpStatus.FORBIDDEN)
  }
  const refresh_token=await this.generateToken({
    email:payload.email,sub:payload.sub},
    this.configService.get<string>('REFRESH_TOKEN_SECRET'),
    this.configService.get<string>('REFRESH_TOKEN_EXPIRY'))
    const access_token=await this.generateToken({
      email:payload.email,sub:payload.sub},
    this.configService.get<string>('ACCESS_TOKEN_SECRET'),
    this.configService.get<string>('ACCESS_TOKEN_EXPIRY'))
    await this.prisma.user.updateMany({
    where:{email:payload.email,id:payload.sub},
    data:{hashedRt:refresh_token}
    })
    res.cookie('access_token',access_token,{httpOnly:true})
    res.cookie('refresh_token',refresh_token,{httpOnly:true})
    return refresh_token

}

async getAllUser(){
  return await this.prisma.user.findMany()
}
//untility...........................................
isPasswordMatch(expectedPassword:string,actualPassword:string){
return verify(expectedPassword,actualPassword)
}

tokenExist(id:number,tokenHash:string){
  return this.prisma.user.findFirst({
    where:{id,hashedRt:tokenHash}
  })
}
removeToken(id:number){
  return this.prisma.user.updateMany({
    where:{id},
    data:{hashedRt:null}
  })
}
getUserByEmail(email:string){
  return this.prisma.user.findUnique({
    where:{email}
  })
}

generateToken(payload:payload,secret:string,expiry:string){
return this.jwtService.signAsync(payload,
  {expiresIn:expiry,secret:secret})
}


}
