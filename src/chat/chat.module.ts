import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatListener } from './listener/newMessage.listener';
@Module({
  providers: [ChatService,ChatListener],
  controllers: [ChatController]
})
export class ChatModule {}
