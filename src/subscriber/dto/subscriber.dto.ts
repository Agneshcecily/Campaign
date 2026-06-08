import { IsNotEmpty, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";



export class SubscriberDto {
   
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    email: string
        
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

}
