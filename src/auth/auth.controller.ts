import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpDto, signInDto, UserResponseDto } from './dtos';
import { GetCurrentUser, Public } from './decorator';
import { payload,googlePayload } from './types';
import { Response } from 'express';
import { GoogleGuard } from './guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarUrlResponseInterceptor } from './intercept/avatarUrl.inrecept';
// import { DefaultPipe } from './pipe/transform/default.pipe';
// import { Role, RolesAccess } from './decorator/role.decorator';
// import { RolesGuard } from './guards/role.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @Public()
  @UseGuards(GoogleGuard)
  async authGoogle() {}

  @Get('google/callback')
  @Public()
  @UseGuards(GoogleGuard)
  async authGoogleCallback(
    @GetCurrentUser() user: googlePayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(user)
    console.log('user')
    const tokens = await this.authService.authGoogleCallback(res, user);
    return tokens;
  }

  @Post('signup')
  @Public()
  // @HttpCode(HttpStatus.BAD_REQUEST)
  //dto validation comes before pip then pip
  // @UsePipes(new DefaultPipe())
  // for route level pipi
  // @Query('page',new DefaultPipe<number>(1),ParseIntPipe) id:number,
  @UseInterceptors(FileInterceptor('avatar'))
  async signUp(
    @Body() dto: signUpDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: /^(image\/jpeg|image\/jpg)$/ }),
        ]
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.authService.signUp(dto, file);
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @Public()
  // @SerializeOptions({
  //   groups: ['role:admin'],
  // })
  @UseInterceptors(AvatarUrlResponseInterceptor)
  async signIn(
    @Body() dto: signInDto,
    @GetCurrentUser() user:payload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponseDto> {
    console.log(user)
    console.log('user')
    const result = await this.authService.signIn(dto, res);
    return new UserResponseDto(result);
  }

  @Delete('logout')
  async Logout(
    @Res({ passthrough: true }) res: Response
  ) {
    return await this.authService.Logout(res);
  }

  @Get('user')
  // @Public()
  // @RolesAccess([Role.User])
  // @UseGuards(RolesGuard)
  async getAllUser() {
    const result = await this.authService.getAllUser();
    return result;
  }
}
