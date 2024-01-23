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
  ParseIntPipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpDto, signInDto, UserResponseDto } from './dtos';
import { GetCurrentUser, Public } from './decorator';
import { payload, googlePayload } from './types';
import { Response } from 'express';
import { GoogleGuard } from './guards';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AvatarUrlResponseInterceptor } from './intercept/avatarUrl.inrecept';
import { DefaultPipe } from './pipe/transform/default.pipe';
import { FileSizeValidationPipe } from 'src/file/pip/validation/fileSize.pipe';
import { GetGoogleUserInfo } from './decorator/getGoogleUserInfo.decorator';
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
    @GetGoogleUserInfo() user: googlePayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(user);
    console.log('user');
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
  // @UseInterceptors(FilesInterceptor('avatar'))
  @UseInterceptors(FileInterceptor('avatar'))
  async signUp(
    @Body() dto: signUpDto,
    // @UploadedFiles(
    @UploadedFile(
      // new FileSizeValidationPipe(),
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: /^(image\/jpeg|image\/jpg)$/ }),
        ],
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
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponseDto> {
    const result = await this.authService.signIn(dto, res);
    return new UserResponseDto(result);
  }

  @Delete('logout')
  async Logout(@Res({ passthrough: true }) res: Response) {
    return await this.authService.Logout(res);
  }

  @Get('user')
  // @Public()
  // @RolesAccess([Role.User])
  // @UseGuards(RolesGuard)
  async getAllUser(
    @Query('page', new DefaultPipe(1), ParseIntPipe) page: number,
    @GetCurrentUser() user: payload,
  ) {
    console.log(page);
    console.log(user);
    const result = await this.authService.getAllUser();
    return result;
  }
}
