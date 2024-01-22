import { IsEmail, IsNotEmpty } from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';

export class signInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class UserResponseDto {
  // @Expose({ groups: ['role:admin'] })
  @Exclude()
  password: string;

  name:string;
  avatar:string;
  url:string;
  // @Expose()
  // @Transform(({ value }) => `hello ${value}`)
  // ur: string;
  constructor(partial: Partial<UserResponseDto>) {
    // console.log('partial')
    // console.log(partial)
    Object.assign(this, partial);
  }
}
