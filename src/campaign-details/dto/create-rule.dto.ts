import { IsString, IsNotEmpty } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class CreateRuleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fieldName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  operator: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  logic: string;
}
