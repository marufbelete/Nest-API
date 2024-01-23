import { Injectable, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { PrismaService } from '../prisma/prisma.service';
import { signInDto, signUpDto } from './dtos';
import { hash, verify } from 'argon2';
import { googlePayload, payload } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { FileService } from 'src/file/file.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private fileService:FileService
  ) {}

  private ACCESS_TOKEN_SECRET = this.configService.get<string>(
    'ACCESS_TOKEN_SECRET',
  );
  private ACCESS_TOKEN_EXPIRY = this.configService.get<string>(
    'ACCESS_TOKEN_EXPIRY',
  );
  private AWS_FOLDER = this.configService.get<string>(
    'AWS_FOLDER',
  );

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

      this.setCookie('access_token', access_token, res);
      return { access_token };
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

    this.setCookie('access_token', access_token, res);
    return { access_token };
  }

  async signUp(dto: signUpDto,avatar:Express.Multer.File) {
    const hasedPassword = await hash(dto.password);
    const avatar_key= await this.fileService.fileUpload(avatar,this.AWS_FOLDER)
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hasedPassword,
        avatar:avatar_key
      },
    });
    return user;
  }

  async signIn(dto: signInDto, res: Response) {
    const user = await this.getUserByEmail(dto.email);
    if (!user) {
      throw new HttpException('Invalid credential', HttpStatus.FORBIDDEN);
    }
    const passwordMatch = await this.isPasswordMatch(
      user.password,
      dto.password,
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
    this.setCookie('access_token', access_token, res);
    // await new Promise((resolve) => setTimeout(resolve, 4000));
    return user;
  }

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

  async Logout(res: Response) {
    this.clearCookie('access_token', res);
    return { sucess: true };
  }

  async getAllUser() {
    return await this.prisma.user.findMany({
      select: this.selectUserFields,
    });
  }

  //untility...........................................

  isPasswordMatch(expectedPassword: string, actualPassword: string) {
    return verify(expectedPassword, actualPassword);
  }

  getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  generateToken(payload: payload, secret: string, expiry: string) {
    return this.jwtService.signAsync(payload, {
      expiresIn: expiry,
      secret: secret,
    });
  }

  setCookie(key: string, token: string, res: Response) {
    res.cookie(key, token, { httpOnly: true });
  }

  clearCookie(key: string, res: Response) {
    res.clearCookie(key);
  }
}
