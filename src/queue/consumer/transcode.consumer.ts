import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QUEUE } from 'src/chat/constants/endpoints';

@Processor(QUEUE.TRANSCODE_QUEUE)
export class TranscodeConsumer {
    private readonly logger=new Logger(TranscodeConsumer.name)
    @Process()
    async transcode(job:Job){
    this.logger.log(job.data)
    this.logger.log('job started for Id of'+ job.id)
    this.logger.log(typeof job.data)
    await new Promise<void>((resolve)=>setTimeout(()=>resolve(),5000))
    this.logger.log('job done for Id of'+ job.id)
    }
}





