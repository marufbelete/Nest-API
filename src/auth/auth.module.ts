import {
  MiddlewareConsumer,
  Module,
  NestModule
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt/dist';
import { JwtStrategy, GoogleStrategy } from './strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './guards/index.guard';
// import { AuthMiddleware } from './middleware/auth.middleware';
import { RolesGuard } from './guards/role.guard';
// import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
// import { TransformResponseInterceptor } from 'src/common/intercept/formatResponse.inrecept';
// import { APP_INTERCEPTOR } from '@nestjs/core';
import { FileModule } from 'src/file/file.module';
import { Session } from './strategy/session.strategy';
// import { IsAuthenticatedGuard } from './guards/session.guard';
// import { PassportModule } from '@nestjs/passport';
// import { RefreshTokenGuard } from './guards/refreshToken.guard';
// import { RefreshTokenStrategy } from './strategy/refreshToken.strategy';
@Module({
  imports: [
    JwtModule.register({}),
    // PassportModule.register({session:true}),
    FileModule
  ],
  //runs according to given sequence
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: RefreshTokenGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: IsAuthenticatedGuard,
    // },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
   
    AuthService,
    JwtStrategy,
    // RefreshTokenStrategy,
    LocalStrategy,
    GoogleStrategy,
    Session
  ],
  controllers: [AuthController],
  exports:[AuthService]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //we can also pass the controller class instead of `product`
    // consumer.apply(ProductMiddleware).forRoutes('product')
    // consumer.apply(AuthMiddleware).forRoutes(
    //   {
    //     path: 'auth/google',
    //     method: RequestMethod.GET,
    //   },
    //   {
    //     path: 'auth/signin',
    //     method: RequestMethod.DELETE,
    //   },
    // );
    // .apply(AnotherMiddleware).forRoutes({
    //   path:'product/:id',
    //   method:RequestMethod.GET
    // },
    // {
    //   path:'product',
    //   method:RequestMethod.DELETE
    // })
    // consumer
    // .apply(LoggerMiddleware)
    // .exclude(
    //   { path: 'cats', method: RequestMethod.GET },
    //   { path: 'cats', method: RequestMethod.POST },
    //   'cats/(.*)',
    // )
    // .forRoutes(CatsController);
  }
}
