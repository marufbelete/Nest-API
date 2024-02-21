import { IsEmail, IsNotEmpty } from 'class-validator';
import { RoomType} from '@prisma/client';


export class createRoomDto {
    /**
 * room name
 * @example room1
 */
  @IsNotEmpty()
  name: string;
     /**
 * room type
 * @example group
 */
  @IsNotEmpty()
  type:RoomType;
  
 
}

export class RoomResponseDto {  

  id:string;
  name: string;
  type:string;
  
  constructor(partial: Partial<RoomResponseDto>) {
    Object.assign(this, partial);
  }
}
export class JoinRoomDto {  
  @IsNotEmpty()
  roomId:string;
  
  constructor(partial: Partial<JoinRoomDto>) {
    Object.assign(this, partial);
  }
}


export class FormattedRoomResponseDto {
  data: RoomResponseDto;
  
}


