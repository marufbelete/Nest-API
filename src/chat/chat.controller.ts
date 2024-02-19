import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
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
    FormattedRoomMessageResponseDto,
  FormattedRoomResponseDto,
  JoinRoomDto,
  RoomMessageResponseDto,
  RoomResponseDto,
  createRoomDto,
} from './dtos/room.dto';

@Controller('chat')
@ApiTags('Chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @ApiResponse({ status: HttpStatus.OK, type: FormattedMessageResponseDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('message')
  async addMessage(
    @Body() message: createMessageDto,
    @GetCurrentUser() user: payload,
  ): Promise<MessageResponseDto> {
    const user_room = await this.chatService.fetchUserRoom({
      userId: user.sub,
      roomId: message.roomId,
    });
    if (!user_room) throw new NotFoundException('resource not');
    const result=await this.chatService.createChat({
      content: message.content,
      user_room_id: user_room.id,
    });
    //broadcast message to all in room
    return result
  }

  @ApiResponse({ status: HttpStatus.OK, type: FormattedRoomResponseDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('room')
  async addRoom(@Body() room: createRoomDto): Promise<RoomResponseDto> {
    return this.chatService.createRoom({
      name: room.name,
      type: room.type,
    });
  }

  @ApiResponse({ status: HttpStatus.OK, type: FormattedRoomMessageResponseDto })
  @HttpCode(HttpStatus.OK)
  @Get('message')
  async getRoomMessage(@Param('roomId') roomId: string):Promise<RoomMessageResponseDto[]> {
    const result=await this.chatService.fetchRoomChat(roomId);
     return result
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('room/join')
  async addUserToRoom(@Body() param:JoinRoomDto,@GetCurrentUser() user: payload,) {
    const result=await this.chatService.createUserRoom(param.roomId,user.sub);
     return result
  }



}
