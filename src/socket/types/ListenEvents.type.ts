import { Prisma } from "@prisma/client";

export interface IListenEvent{
    chatMessage:(payload:Prisma.MessageCreateInput) =>void;
    joinRoom:(payload:Prisma.RoomCreateInput) =>void;
}
