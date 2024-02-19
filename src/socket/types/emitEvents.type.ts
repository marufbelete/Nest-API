import { Prisma } from "@prisma/client";

export interface IEmitEvent{
    chatMessage:(payload:Prisma.MessageCreateInput) =>void;
}