import { PartialType } from '@nestjs/mapped-types';
import { CreateCampaignDetailDto } from './create-campaign-detail.dto';

export class UpdateCampaignDetailDto extends PartialType(CreateCampaignDetailDto) {}
