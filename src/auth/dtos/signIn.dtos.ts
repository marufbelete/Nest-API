import {IsNotEmpty } from "class-validator";

export class signInDto{
    @IsNotEmpty()
    email:string;
    @IsNotEmpty()
    password:string;
}
