import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {

    constructor(
        private prisma: PrismaService,
    ){}

   async createChat(message:{content:string,user_room_id:string}){
    return await this.prisma.message.create({
        data:{
            content:message.content,
            user_room:{
            connect:{id:message.user_room_id,}
            },
        },
        select:{
            id:true,
            content:true,
            user_room:{
                select:{
                    id:true,
                    isAdmin:true,
                    user:{
                        select:
                            {
                            id:true,
                            email:true,
                            name:true
                            }
                    }
                },
            }
        }
       })
    }

   async fetchUserRoom(param:{userId:string, roomId:string}){
       return await this.prisma.user_Room.findFirst({
       where:{
        userId:param.userId,
        roomId:param.roomId,
       },
       select:{
        id:true
       }
       })
       
    }
    
   async createRoom(param:Prisma.RoomCreateInput){
       return await this.prisma.room.create({
       data:{
        name:param.name,
        type:param.type
        }
       })
       
    }

   async createUserRoom(roomId:string,userId:string){
    console.log(userId)
    return await this.prisma.room.update({
        where: { id: roomId },
        data: {
          users:{
            create:{
                user:{
                    connect:{id:userId}
                }
            },
         
          }
        },
      });       
    }

   async fetchRoomChat(roomId:string){
       return await this.prisma.message.findMany({
      where:{
        user_room:{
            roomId,
        }
      },
      select:{
        id:true,
        content:true,
        user_room:{
           select:{
            id:true,
            isAdmin:true,
            user:{
                select:{
                    id:true,
                    email:true,
                    name:true
                }
            }
           }
        }
      }
       })
       
    }


}
