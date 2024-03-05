import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  FormattedMessageResponseDto,
  MessageResponseDto,
  createMessageDto,
} from './dtos';
import { GetCurrentUser } from 'src/auth/decorator';
import { payload } from 'src/auth/types';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  FormattedRoomResponseDto,
  JoinRoomDto,
  RoomResponseDto,
  createRoomDto,
} from './dtos/room.dto';
import { EventsGateway } from 'src/socket/socket.gateway';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { CHAT_ENDPOINT } from './constants/endpoints';

@Controller(CHAT_ENDPOINT.CHAT)
@ApiTags('Chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private eventsGateway: EventsGateway,
  ) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    type: FormattedMessageResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post(CHAT_ENDPOINT.MESSAGE)
  async addMessage(
    @Body() message: createMessageDto,
    @GetCurrentUser() user: payload,
  ): Promise<MessageResponseDto> {
    const user_room = await this.chatService.fetchUserRoom({
      userId: user.sub,
      roomId: message.roomId,
    });
    if (!user_room) throw new NotFoundException('resource not');
    const result = await this.chatService.createChat({
      content: message.content,
      user_room_id: user_room.id,
    });
    //broadcast message to all in room
    this.eventsGateway.sendMessage(result.user_room.room.name, result);
    return result;
  }

  @ApiResponse({ status: HttpStatus.OK, type: FormattedRoomResponseDto })
  @HttpCode(HttpStatus.CREATED)
  @Post(CHAT_ENDPOINT.ROOM)
  async addRoom(@Body() room: createRoomDto): Promise<RoomResponseDto> {
    return this.chatService.createRoom({
      name: room.name,
      type: room.type,
    });
  }

  @Get(CHAT_ENDPOINT.MESSAGE)
  @ApiResponse({ status: HttpStatus.OK, type: FormattedMessageResponseDto })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(200000)
  async getRoomMessage(
    @Param('roomId') roomId: string,
  ): Promise<MessageResponseDto[]> {
    const result = await this.chatService.fetchRoomChat(roomId);
    return result;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post(CHAT_ENDPOINT.JOIN_ROOM)
  async addUserToRoom(
    @Body() param: JoinRoomDto,
    @GetCurrentUser() user: payload,
  ) {
    const result = await this.chatService.createUserRoom(
      param.roomId,
      user.sub,
    );
    return result;
  }

  @ApiResponse({
    status: HttpStatus.OK
    })
  @Get(CHAT_ENDPOINT.QUEUE)
  async queueTest() {
    const result = this.chatService.transcode({data:"test mp4 transmission"});
    console.log('returned')
    return result
  }

}
