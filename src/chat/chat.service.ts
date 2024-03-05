import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewMessageEvent } from './events/newMessage.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { QueueService } from 'src/queue/queue.service';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    private queueservice: QueueService
  ) {}

  async transcode(param:{data:string}) {
    await this.queueservice.transcode(param)
}

  async createChat(message: { content: string; user_room_id: string }) {
    const result = await this.prisma.message.create({
      data: {
        content: message.content,
        user_room: {
          connect: { id: message.user_room_id },
        },
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user_room: {
          select: {
            id: true,
            isAdmin: true,
            room: {
              select: {
                id: true,
                name: true,
              },
            },
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });
    const updatedMessageHistory = await this.fetchRoomChat();
    const messageEvent=new NewMessageEvent()
    messageEvent.payload=updatedMessageHistory
    
    // setImmediate(() => {
      this.eventEmitter.emit('message.created',messageEvent);
      // this.eventEmitter.emitAsync('message.created',messageEvent);//to listen bak the response
    // });
    return result;
  }

  async fetchUserRoom(param: { userId: string; roomId: string }) {
    return await this.prisma.user_Room.findFirst({
      where: {
        userId: param.userId,
        roomId: param.roomId,
      },
      select: {
        id: true,
      },
    });
  }

  async createRoom(param: Prisma.RoomCreateInput) {
    return await this.prisma.room.create({
      data: {
        name: param.name,
        type: param.type,
      },
    });
  }

  async createUserRoom(roomId: string, userId: string) {
    return await this.prisma.room.update({
      where: { id: roomId },
      data: {
        users: {
          create: {
            user: {
              connect: { id: userId },
            },
          },
        },
      },
    });
  }

  async fetchRoomChat(roomId?: string) {
    return await this.prisma.message.findMany({
      where: {
        user_room: {
          roomId,
        },
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user_room: {
          select: {
            id: true,
            isAdmin: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }
}
