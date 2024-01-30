import { Injectable, HttpStatus } from '@nestjs/common';
import { ForbiddenException, HttpException } from '@nestjs/common/exceptions';
import { PrismaService } from '../prisma/prisma.service';
import { signInDto, signUpDto } from './dtos';
import { hash, verify } from 'argon2';
import { RefreshTokenFilter, googlePayload, payload } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { FileService } from 'src/file/file.service';
import * as CsrfTokens from 'csrf';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private fileService: FileService,
  ) {}

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
  private AWS_FOLDER = this.configService.get<string>('AWS_FOLDER');

  private FRONTEND_BASE_URL =
    this.configService.get<string>('FRONTEND_BASE_URL');

  private selectUserFields = {
    id: true,
    email: true,
    name: true,
    isLocalAuth: true,
    googleId: true,
    createdAt: true,
    updatedAt: true,
  };
  async authGoogleCallback(res: Response, user: googlePayload) {
    const db_user = await this.getUserByEmail(user.email);
    if (!db_user) {
      const name = user.first_name + ' ' + user.last_name;
      const new_user = await this.prisma.user.create({
        data: {
          name: name,
          email: user.email,
          isLocalAuth: false,
          googleId: user.googleId,
        },
      });
      const payload = { email: user.email, sub: new_user.id };
      const access_token = await this.generateToken(
        payload,
        this.ACCESS_TOKEN_SECRET,
        this.ACCESS_TOKEN_EXPIRY,
      );
      const refresh_token = await this.generateToken(
        payload,
        this.REFRESH_TOKEN_SECRET,
        this.REFRESH_TOKEN_EXPIRY,
      );

      this.setCookie('access_token', access_token, res);
      this.setCookie('refresh_token', refresh_token, res);
      return;
    }
    if (db_user && db_user.isLocalAuth) {
      throw new HttpException(
        'This email not linked to google, please use email and password to login',
        HttpStatus.BAD_REQUEST,
      );
    }
    const payload = { email: db_user.email, sub: db_user.id };
    const access_token = await this.generateToken(
      payload,
      this.ACCESS_TOKEN_SECRET,
      this.ACCESS_TOKEN_EXPIRY,
    );
    const refresh_token = await this.generateToken(
      payload,
      this.REFRESH_TOKEN_SECRET,
      this.REFRESH_TOKEN_EXPIRY,
    );
    this.setCookie('access_token', access_token, res);
    this.setCookie('refresh_token', refresh_token, res);
    return;
  }

  async signUp(dto: signUpDto, avatar: Express.Multer.File) {
    const hasedPassword = await hash(dto.password);
    const avatar_key = await this.fileService.fileUpload(
      avatar,
      this.AWS_FOLDER,
    );
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hasedPassword,
        avatar: avatar_key,
      },
    });
    return user;
  }

  async signIn(incoming_user: signInDto, res: Response) {
    const user = await this.getUserByEmail(incoming_user.email);
    if (!user) {
      throw new HttpException('Invalid credential', HttpStatus.FORBIDDEN);
    }
    const passwordMatch = await this.isPasswordMatch(
      user.password,
      incoming_user.password,
    );
    if (!passwordMatch) {
      throw new HttpException('Invalid credential', HttpStatus.FORBIDDEN);
    }
    const payload = { email: user.email, sub: user.id };
    const access_token = await this.generateToken(
      payload,
      this.ACCESS_TOKEN_SECRET,
      this.ACCESS_TOKEN_EXPIRY,
    );
    const refresh_token = await this.generateToken(
      payload,
      this.REFRESH_TOKEN_SECRET,
      this.REFRESH_TOKEN_EXPIRY,
    );
    await this.addToken(refresh_token, payload.sub);
    this.setCookie('access_token', access_token, res);
    this.setCookie('refresh_token', refresh_token, res);
    return user;
  }

  // async refreshToken(payload: payload, tokenHash: string, res: Response) {
  //   const token = await this.tokenExist(payload.sub, tokenHash);
  //   if (!token || token.blacklist) {
  //     await this.removeToken({ userId: payload.sub });
  //     throw new HttpException('Token compromised', HttpStatus.FORBIDDEN);
  //   }
  //   const payload_data = { email: payload.email, sub: payload.sub };
  //   const refresh_token = await this.generateToken(
  //     payload_data,
  //     this.REFRESH_TOKEN_SECRET,
  //     this.REFRESH_TOKEN_EXPIRY,
  //   );
  //   await this.prisma.refreshToken.updateMany({
  //     where: { userId: payload.sub },
  //     data: { hashedRt: refresh_token },
  //   });
  //   this.setCookie('refresh_token', refresh_token, res);
  //   return refresh_token;
  // }

  // async validateUser(email: string, password: string): Promise<any> {
  //   const user = await this.getUserByEmail(email);
  //   const passwordMatch: boolean = await this.isPasswordMatch(
  //     user.password,
  //     password,
  //   );
  //   if (!passwordMatch)
  //     throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
  //   return {
  //     id: user.id,
  //     email: user.email,
  //     name: user.name,
  //   };
  // }

  async getCsrfToken(res: Response) {
    const {csrf_token,secret}=await this.generateCsrfToken()
    this.setCookie('_csrf',secret, res);
    return { csrf_token};
  }

  async logout(res: Response, refresh_token: string, user: payload) {
    this.removeToken({ hashedRt: refresh_token, userId: user.sub });
    this.clearCookie('access_token', res);
    return { sucess: true };
  }

  async getAllUser() {
    return await this.prisma.user.findMany({
      select: this.selectUserFields,
    });
  }

  googleRedirectUrl() {
    // Access instance properties or services here
    return `${this.FRONTEND_BASE_URL}/dashboard/auth`;
  }

  //untility...........................................

  async isPasswordMatch(expectedPassword: string, actualPassword: string) {
    return verify(expectedPassword, actualPassword);
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  validateToken(token: string, secret: string) {
    return this.jwtService.verify(token, { secret });
  }

  async tokenExist(sub: string, refresh_token: string) {
    return this.prisma.refreshToken.findFirst({
      where: { userId: sub, hashedRt: refresh_token },
    });
  }

  async removeToken(filter: RefreshTokenFilter) {
    return this.prisma.refreshToken.deleteMany({
      where: filter,
    });
  }

  async addToken(token: string, sub: string) {
    return this.prisma.refreshToken.create({
      data: {
        hashedRt: token,
        userId: sub,
      },
    });
  }

  async upsertToken(old_token: string, token: string, sub: string) {
    return this.prisma.refreshToken.upsert({
      where: { hashedRt: old_token, userId: sub },
      update: {
        hashedRt: token,
      },
      create: {
        hashedRt: token,
        userId: sub,
      },
    });
  }

  async generateToken(payload: payload, secret: string, expiry: string) {
    return this.jwtService.signAsync(payload, {
      expiresIn: expiry,
      secret: secret,
    });
  }

  setCookie(key: string, token: string, res: Response) {
    res.cookie(key, token, {
      httpOnly: true,
      secure: true,
      sameSite:'none'
    });
  }

  clearCookie(key: string, res: Response) {
    res.clearCookie(key, { httpOnly: true, secure: true, sameSite: 'none'});
  }

  async generateCsrfToken() {
    const tokens = new CsrfTokens();
    const secret = tokens.secretSync();
    const token = tokens.create(secret);
    return {
      csrf_token:token,
      secret
    };
    
  }
}
