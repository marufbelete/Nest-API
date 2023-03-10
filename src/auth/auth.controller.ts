import { Body, Controller, Get, HttpCode, 
HttpStatus, Post, Res,UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import {signUpDto,signInDto } from './dtos';
import { GetCurrentUser, Public} from 'src/common/decorator';
import { payload } from './types';
import { GetToken } from 'src/common/decorator';
import { Response } from 'express';
import { GoogleGuard } from 'src/common/guards';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}

    @Get('google')
    @Public()
    @Public('refresh_token')
    @UseGuards(GoogleGuard)
    async authGoogle(){}

    @Get('google/callback')
    @Public()
    @Public('refresh_token')
    @UseGuards(GoogleGuard)
    async authGoogleCallback(@GetCurrentUser() user:payload){
      //call service that will check user in db and if not exist register it 
      // and assign new acccess_token and refresh_token
      return user
    }

    @Post('signup')
    @Public()
    @Public('refresh_token')
    async signUp(@Body() dto:signUpDto){
      const result=await this.authService.signUp(dto)
      return result
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    @Public()
    @Public('refresh_token')
    async signIn(@Body() dto:signInDto,@Res() res:Response){
      const result=await this.authService.signIn(dto,res)
      return res.json(result)
    }

    @Get('refreshtoken')
    @Public()
    async refreshToken(@GetCurrentUser() user:payload,
      @GetToken('refresh_token') tokenHash:string,
      @Res() res:Response){
        console.log(user,tokenHash)
      const result=await this.authService
      .refreshToken(user,tokenHash,res)
      return res.json({refresh_token:result})
    }

    @Get('user')
    async getAllUser(@GetCurrentUser() user:payload){
      const result=await this.authService.getAllUser()
      return result
    }

}