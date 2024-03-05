import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NewMessageEvent } from '../events/newMessage.event';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CHAT_ENDPOINT } from '../constants/endpoints';
import { ChatService } from '../chat.service';

@Injectable()
export class ChatListener {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private chatService:ChatService
    ){}

  @OnEvent('message.created')
  handleNewMessageEvent(event: NewMessageEvent) {
    console.log("in event")
    console.log(event.payload)
    // throw new Error("killing")
    this.cacheManager.set(`/${CHAT_ENDPOINT.CHAT}/${CHAT_ENDPOINT.MESSAGE}`,event.payload);
  }
}