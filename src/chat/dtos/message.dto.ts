import { IsEmail, IsNotEmpty } from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiHideProperty, ApiProperty, PartialType } from '@nestjs/swagger';
import { User } from '@prisma/client';


export class createMessageDto {
    /**
 * message content
 * @example Hello
 */
  @IsNotEmpty()
  content: string;
     /**
 * conersationId
 * @example 11237126376
 */
  @IsNotEmpty()
  roomId:string;
  
 
}

export class MessageResponseDto {  

  id:string;
  content: string;
  createdAt:Date;
  updatedAt:Date;
  user_room:{
    id:string;
    isAdmin:boolean;
    user:{
      id:string;
      name:string;
      email:string;

    }
    
  }

  constructor(partial: Partial<MessageResponseDto>) {
    Object.assign(this, partial);
  }
}

export class FormattedMessageResponseDto {
  data: MessageResponseDto[];
  
}

