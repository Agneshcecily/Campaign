import { IsNotEmpty, isNotEmpty, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class subscriberattributeDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    key: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    value: string;

}