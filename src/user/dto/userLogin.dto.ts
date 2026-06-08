import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger";


export class UserLoginDto{
    
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    emailId:string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password:string;

    @ApiProperty()
    @IsBoolean()
    isVerified:boolean;

    @ApiProperty()
    @IsNumber()
    attemptCount:number;

    @ApiProperty()
    @IsNumber()
    otp_id:number;



}