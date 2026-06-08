import { IsJSON, IsNotEmpty, IsNumber, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserProfileDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName:string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName:string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    mobileNumber:number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    address:string;

    @ApiProperty()
    @IsJSON()
    @IsNotEmpty()
    otherInfo:any;

}
