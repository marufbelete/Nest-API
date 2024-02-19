import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Role, RolesAccess } from 'src/auth/decorator/role.decorator';
import { Injectable, UseGuards } from '@nestjs/common';
import { IEmitEvent } from './types/emitEvents.type';
import { IsAuthenticatedGuard } from 'src/auth/guards/session.guard';
import { WsException } from '@nestjs/websockets';
import { NextFunction} from 'express';
import { IListenEvent } from './types/ListenEvents.type';
import { CommonService } from 'src/common/common.service';
@Injectable()
@WebSocketGateway({ cookie: true })
export class EventsGateway implements OnGatewayConnection {
  constructor(
    private commonService: CommonService,
  ) {}

  @WebSocketServer()
  private server: Server<IListenEvent, IEmitEvent>;

  //from lient
  // const socket = io({
  //   auth: {
  //     token: "abc"
  //   }
  // });
  afterInit(socket: Socket): void {
    socket.use(this.SocketAuthMiddleware as any);
  }

  handleConnection(socket: Socket): void {
    socket.on('disconnect', () => {
      console.log('disconnect');
      console.log(socket.id);
    });
  }

  @RolesAccess([Role.User])
  @UseGuards(IsAuthenticatedGuard)
  @SubscribeMessage<keyof IListenEvent>('chatMessage')
  async handleEvent(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket<IListenEvent, IEmitEvent>,
  ) {
    const event = { message: 'events' };
    console.log(data);
    client.data.userId = { userId: data.userId, socketId: client.id };
    const user_sockets = await this.server.in(client.id).fetchSockets();
    console.log(user_sockets[0].data);
    // console.log(user_sockets[1].data)
    // client.broadcast.emit("event","instane")
    // this.server.to(client.id).emit('chatMessage','from server')
    return { test: event };
  }

  @SubscribeMessage<keyof IListenEvent>('joinRoom')
  async socketIdEvent(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket<IListenEvent, IEmitEvent>,
  ) {
    client.data.userId = { userId: data.userId, socketId: client.id };
    return client.id;
  }

  // @SubscribeMessage('events')
  // handleEvent(client: Client, data: unknown): WsResponse<unknown> {
  //   const event = 'events';
  //   return { event, data };
  // }


  //helper
  SocketAuthMiddleware(socket: Socket, next:NextFunction): void {
    console.log(socket.handshake.headers.cookie);
    try {
      this.commonService.validateToken(
        socket.handshake.headers.token as string,
        this.commonService.ACCESS_TOKEN_SECRET,
      );
      next();
    } catch {
      next(new WsException('Invalid credentials.'));
    }
  }
}

// socket.emit('message', "this is a test"); //sending to sender-client only

// socket.broadcast.emit('message', "this is a test"); //sending to all clients except sender

// socket.broadcast.to('game').emit('message', 'nice game'); //sending to all clients in 'game' room(channel) except sender

// socket.to('game').emit('message', 'enjoy the game'); //sending to sender client, only if they are in 'game' room(channel)

// io.emit('message', "this is a test"); //sending to all clients, include sender

// io.in('game').emit('message', 'cool game'); //sending to all clients in 'game' room(channel), include sender

// io.of('myNamespace').emit('message', 'gg'); //sending to all clients in namespace 'myNamespace', include sender

// io.to(id).emit; //for emiting to specific clients

// io.sockets.emit(); //send to all connected clients (same as socket.emit)

// io.sockets.on() ; //initial connection from a client.