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
  Redirect,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpDto, signInDto, UserResponseDto, FormattedUserResponseDto } from './dtos';
import { GetCurrentUser, GetToken, Public } from './decorator';
import { payload, googlePayload } from './types';
import { Response } from 'express';
import { GoogleGuard } from './guards/index.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AvatarUrlResponseInterceptor } from './intercept/avatarUrl.inrecept';
import { DefaultPipe } from './pipe/transform/default.pipe';
import { FileSizeValidationPipe } from 'src/file/pip/validation/fileSize.pipe';
import { GetGoogleUserInfo } from './decorator/getGoogleUserInfo.decorator';
import { ConfigService } from '@nestjs/config';
import { ApiResponse, ApiResponseProperty, ApiTags } from '@nestjs/swagger';
import { Error4xxResponseDto } from 'src/common/dtos/4xx.dto';
// import { RefreshTokenGuard } from './guards/refreshToken.guard';
// import { Role, RolesAccess } from './decorator/role.decorator';
// import { RolesGuard } from './guards/role.guard';
@Controller('auth')
@ApiTags('Auth')
// @Controller({ path:'auth',host: 'http://localhost:3011' })
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}
  private FRONTEND_BASE_URL =
    this.configService.get<string>('FRONTEND_BASE_URL');
  private google_redirect_url = `${this.FRONTEND_BASE_URL}`;
  @Get('google')
  @Public()
  @UseGuards(GoogleGuard)
  async authGoogle() {}
  @Get('google/callback')
  @Public()
  @UseGuards(GoogleGuard)
  @Redirect('http://localhost:3011/auth', 302)
  async authGoogleCallback(
    @GetGoogleUserInfo() user: googlePayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.authGoogleCallback(res, user);
    return { url: `${this.google_redirect_url}/dashboard` };
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
  // @Public('refresh')
  // @SerializeOptions({
  //   groups: ['role:admin'],
  // })
  // @UsePipes(new DefaultPipe())
  @UseInterceptors(AvatarUrlResponseInterceptor)
  @ApiResponse({ status: HttpStatus.OK,type:FormattedUserResponseDto})
  @ApiResponse({ status: '4XX',type:Error4xxResponseDto})
  
  async signIn(
    @Body() user: signInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponseDto> {
    const result = await this.authService.signIn(user, res);
    return new UserResponseDto(result);
    // new FormattedUserResponseDto(result);
  }

  // @Post('refreshtoken')
  // @UseGuards(RefreshTokenGuard)
  // async refreshToken(
  //   @GetCurrentUser() user: payload,
  //   @GetToken('refresh_token') tokenHash: string,
  //   @Res() res: Response,
  // ) {
  //   const result = await this.authService.refreshToken(user, tokenHash, res);
  //   return res.json({ refresh_token: result });
  // }

  @Get('profile')
  async authProfile(@GetCurrentUser() user: payload): Promise<UserResponseDto> {
    const result = await this.authService.getUserByEmail(user.email);
    return  new UserResponseDto(result) 
    // new FormattedUserResponseDto(result);
  }

  @Post('csrfToken')
  @Public()
  async authCsrfToken(@Res({ passthrough: true }) res: Response) {
    const result = await this.authService.getCsrfToken(res);
    console.log(result)
    return result;
  }

  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @GetToken('refresh_token') tokenHash: string,
    @GetCurrentUser() user: payload,
  ) {
    return this.authService.logout(res, tokenHash, user);
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
    return await this.authService.getAllUser();
  }
}
