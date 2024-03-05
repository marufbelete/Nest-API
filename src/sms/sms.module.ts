import { Global, Module } from '@nestjs/common';
import { TwilioSmsService } from './sms.service';

@Global()
@Module({
    providers: [TwilioSmsService],
    exports:[TwilioSmsService]})
export class SmsModule {
}
