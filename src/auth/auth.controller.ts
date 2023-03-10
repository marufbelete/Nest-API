import { Body, Controller, Delete, Get, HttpCode, 
HttpStatus, Post, Res,UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import {signUpDto,signInDto } from './dtos';
import { GetCurrentUser, Public} from 'src/common/decorator';
import { payload } from './types';
import { GetToken } from 'src/common/decorator';
import { Response } from 'express';
import { GoogleGuard } from 'src/common/guards';
import { googlePayload } from './types';

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
    async authGoogleCallback(@GetCurrentUser() user:googlePayload,@Res() res:Response){
      const tokens=await this.authService.authGoogleCallback(res,user)
      return res.json(tokens)
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
      const result=await this.authService
      .refreshToken(user,tokenHash,res)
      return res.json({refresh_token:result})
    }

    @Delete('logout')
    async Logout(@Res() res:Response,@GetCurrentUser() user:payload){
     return await this.authService.Logout(res,user)
    }

    @Get('user')
    async getAllUser(@GetCurrentUser() user:payload){
      const result=await this.authService.getAllUser()
      return result
    }

}
