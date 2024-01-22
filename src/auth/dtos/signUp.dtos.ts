import { IsNotEmpty, IsStrongPassword } from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';
import { User } from '@prisma/client';

export class signUpDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

}

// user.dto.ts


