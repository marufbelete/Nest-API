import {IsNotEmpty, IsStrongPassword } from "class-validator";

export class signUpDto{
    @IsNotEmpty()
    name:string;
    @IsNotEmpty()
    email:string;
    @IsNotEmpty()
    @IsStrongPassword()
    password:string;
}
