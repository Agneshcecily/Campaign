import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ScheduleDto {
  @ApiProperty({ example: 'user1@example.com,user2@example.com' })
  @IsNotEmpty()
  @IsString()
  to: string[]; 

  @ApiProperty({ example: 'Upcoming Offer!' })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({ example: '<p>Here is your email content</p>' })
  @IsNotEmpty()
  @IsString()
  html: string;

  @ApiProperty({ example: '2025-06-13T10:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  scheduledAt: string;

  @ApiProperty({ example: 'Asia/Kolkata' })
  @IsNotEmpty()
  @IsString()
  timeZone: string;
}
