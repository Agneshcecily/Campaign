import { IsNotEmpty, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class subscribergroupDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    senderEmail: string;

} 