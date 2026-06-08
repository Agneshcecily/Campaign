import { IsNotEmpty, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class SourceDto{
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
}