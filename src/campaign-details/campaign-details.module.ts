import { Module } from '@nestjs/common';
import { CampaignDetailsService } from './campaign-details.service';
import { CampaignDetailsController, ObjectiveMasterController } from './campaign-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignDetails } from './entities/campaign-detail.entity';
import { TemplateMaster } from './entities/templateMaster.entity';
import { ObjectiveMaster } from './entities/objective-master.entity';
import { Schedule } from './entities/schedule.entity';

@Module({
  imports:[TypeOrmModule.forFeature([CampaignDetails,TemplateMaster,ObjectiveMaster,Schedule])],
  controllers: [CampaignDetailsController,ObjectiveMasterController],
  providers: [CampaignDetailsService],
  
})
export class CampaignDetailsModule {}
