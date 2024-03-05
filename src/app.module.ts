import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import {redisStore} from 'cache-manager-redis-yet';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { QUEUE } from './chat/constants/endpoints';
import { QueueModule } from './queue/queue.module';
import { EmailModule } from './email/email.module';
import { SmsModule } from './sms/sms.module';
@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'client'),
    // }),
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.register({
      storage: memoryStorage(),
    }),
    EventEmitterModule.forRoot({global:true}),
    CacheModule.register({
      isGlobal:true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      // username: process.env.REDIS_USERNAME, 
      // password: process.env.REDIS_PASSWORD, 
      // no_ready_check: true, // new property
    }),
    // CacheModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory:async(configService:ConfigService)=>({
    //     isGlobal:true,
    //     store: redisStore,
    //     host: configService.get<string>('REDIS_HOST'),
    //     port: configService.get<string>('REDIS_PORT'),
    //     // username: configService.get<string>('REDIS_USERNAME'), 
    //     // password: configService.get<string>('REDIS_PASSWORD'), 
    //     // no_ready_check: true, // new property
    //   }),
    //   inject: [ConfigService],
    // }),
    AuthModule,
    PrismaModule,
    FileModule,
    PostModule,
    SocketModule,
    CommonModule,
    ChatModule,
    QueueModule,
    EmailModule,
    SmsModule
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
