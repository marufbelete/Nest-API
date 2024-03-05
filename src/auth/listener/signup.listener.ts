import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserSignUpEvent } from '../events/signup.event';
import { TwilioSmsService } from 'src/sms/sms.service';

@Injectable()
export class SignupListener {
  constructor(
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
    // private chatService:ChatService
    private twilioSmsService: TwilioSmsService,
  ) {}

  @OnEvent('user.created')
  handleUserSignUpEvent(event: UserSignUpEvent) {
    console.log("sms listeing")
    this.twilioSmsService.sendSms(event.message, event.to);
  }
}
