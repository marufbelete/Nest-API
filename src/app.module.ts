import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { FileService } from './file/file.service';
import { FileModule } from './file/file.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    MulterModule.register({
      storage: memoryStorage()
    }),
    AuthModule, 
    PrismaModule, FileModule
  ],
  providers: [FileService]
})
export class AppModule {
  constructor(){
  }
}
