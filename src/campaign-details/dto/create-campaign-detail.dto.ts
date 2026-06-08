import { IsString, IsNotEmpty, IsInt } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignDetailDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  campName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  senderName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  senderEmail: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsInt()
  objectiveId: number;

  @ApiProperty()
  @IsInt()
  templateId: number;

  @ApiProperty()
  @IsInt()
  ruleId: number;

  @ApiProperty()
  @IsInt()
  scheduleId: number;

  @ApiProperty()
  @IsInt()
  timeZoneMasterId: number;
}
