import { MessageResponseDto } from "src/chat/dtos";

export interface IEmitEvent{
    chatMessage:(payload:MessageResponseDto) =>void;
}