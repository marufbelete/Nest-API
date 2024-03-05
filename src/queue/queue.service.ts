import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { QUEUE } from 'src/chat/constants/endpoints';

@Injectable()
export class QueueService {
    constructor(
        @InjectQueue(QUEUE.TRANSCODE_QUEUE) private transcodeQueue: Queue,
      ) {}

      async transcode(param:{data:string}) {
        console.log('read data')
        await this.transcodeQueue.add(param)
    }

}
