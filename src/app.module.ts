import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
// import { FileService } from './file/file.service';
import { FileModule } from './file/file.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { RequestLoggerMiddleware } from './common/middleware/requestLogger.middleware';
import { TransformResponseInterceptor } from 'src/common/intercept/formatResponse.inrecept';
import { APP_INTERCEPTOR } from '@nestjs/core';
// import { HostFilterMiddleware } from './common/middleware/hostFilter.middleware';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
// import { CsrfMiddleware } from './common/middleware/csrf.middleware';
// import { AuthController } from './auth/auth.controller';
import { PostModule } from './post/post.module';
import { SocketModule } from './socket/socket.module';
import { CommonModule } from './common/common.module';
import { ChatModule } from './chat/chat.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.register({
      storage: memoryStorage(),
    }),
    AuthModule,
    PrismaModule,
    FileModule,
    PostModule,
    SocketModule,
    CommonModule,
    ChatModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AppModule {
  constructor() {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
    // .apply(CsrfMiddleware)
    // .exclude(
    //   { method: RequestMethod.GET, path: 'auth/(.*)' },
    //   { method: RequestMethod.POST, path: 'auth/csrfToken' },
    // ).forRoutes(AuthController);
    // .apply(HostFilterMiddleware).forRoutes('*')
  }
}
