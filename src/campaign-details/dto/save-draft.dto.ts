import {
  IsString,
  IsOptional,
  IsArray,
  IsObject,
  IsNumber,
  IsEnum,
} from 'class-validator';

export class SaveDraftDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString()
  campName?: string;

  @IsOptional()
  @IsString()
  senderName?: string;

  @IsOptional()
  @IsString()
  senderEmail?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  objectiveId?: string;

  @IsOptional()
  @IsArray()
  selectedAudienceIds?: string[];

  @IsOptional()
  @IsString()
  selectedTemplateHtml?: string;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  @IsString()
  deliveryMethod?: string;

  @IsOptional()
  @IsString()
  selectedTimeZone?: string;

  @IsOptional()
  @IsObject()
  targetRules?: Record<string, any>;

  @IsOptional()
  @IsNumber()
  step?: number;

  @IsOptional()
  @IsEnum(['draft', 'schedule', 'send'])
  status?: 'draft' | 'schedule' | 'send';
}
