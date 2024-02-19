import { IsEmail, IsNotEmpty } from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiHideProperty, ApiProperty, PartialType } from '@nestjs/swagger';


export class signInDto {
    /**
 * user email address
 * @example maruf@gmail.com
 */
  @IsNotEmpty()
  @IsEmail()
  email: string;
  
   /**
 * user password
 * @example Maruf3839!
 */
  @IsNotEmpty()
  password: string;
}

export class UserResponseDto {
  // @Expose({ groups: ['role:admin'] })
  
  @ApiHideProperty()
  @Exclude()
  password: string;
  name:string;
  email:string;
  isLocalAuth:boolean;
  googleId:string;
  avatar:string;
  url:string;
  createdAt:Date;
  updatedAt:Date;
  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

export class FormattedUserResponseDto {
  // constructor(partial: Partial<UserResponseDto>) {
  //   Object.assign(this, partial);
  // }
  data: UserResponseDto;
  
}
export class Error4xxResponseDto {
  data: {message:string};
  
}
// export class UpdateCatAgeDto extends PickType(CreateCatDto, ['age'] as const) {}
// export class UpdateCatDto extends PartialType(CreateCatDto) {}
