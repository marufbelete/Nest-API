import { Global, Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QUEUE } from 'src/chat/constants/endpoints';
import { TranscodeConsumer } from './consumer/transcode.consumer';

@Global()
@Module({
  imports:[
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory:async(configService:ConfigService)=>({
        redis: {
            host: configService.get<string>('REDIS_HOST'),
            port:configService.get<number>('REDIS_PORT')
          }
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: QUEUE.TRANSCODE_QUEUE,
    }),
  ],
  providers: [
    QueueService,
    TranscodeConsumer
  ],
  exports:[
    QueueService
  ]
})
export class QueueModule {}
