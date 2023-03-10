import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt/dist';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategy';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard, RefreshTokenGuard } from 'src/common/guards';

@Module({
  imports:[JwtModule.register({})],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard
    },
    {
      provide: APP_GUARD,
      useClass: RefreshTokenGuard
    },
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
