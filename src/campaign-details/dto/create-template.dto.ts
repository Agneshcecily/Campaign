import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTemplateDto {
    @ApiProperty()
      @IsString()
      @IsNotEmpty()
  name: string;

  @ApiProperty()
    @IsString()
    @IsNotEmpty()
  htmlContent: string;
}
