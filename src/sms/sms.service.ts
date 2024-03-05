import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Twilio from 'twilio';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

abstract class SmsService {
abstract sendSms(message: string, to: string):Promise<MessageInstance>;
}

@Injectable()
export class TwilioSmsService extends SmsService {
    logger=new Logger(TwilioSmsService.name)
    constructor(
     private configService: ConfigService
    ){
        super()
    }
    // private accountSid= this.configService.get<string>('TWILIO_ACCOUNT_SID');
    // private authToken= this.configService.get<string>('TWILIO_AUTH_TOKEN');
    private client = Twilio();
    private messagingServiceSid =this.configService.get<string>('TWILIO_SERVICE_ID');
    async sendSms(message: string, to: string) {
        this.logger.log(message,to)
        return this.client.messages.create({
            body: message,
            to: to, // Text your number
            // messagingServiceSid: this.messagingServiceSid,
            // scheduleType:
            from: 'whatsapp:+14155238886', // From a valid Twilio number
            // from: '+12077473070', // From a valid Twilio number
      });
    }
}
