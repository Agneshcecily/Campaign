import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { CampaignDetailsService } from './campaign-details.service';
import { CreateCampaignDetailDto } from './dto/create-campaign-detail.dto';
import { UpdateCampaignDetailDto } from './dto/update-campaign-detail.dto';
import { SendMailDto } from './dto/send-mail.dto';
import { SaveDraftDto } from './dto/save-draft.dto';
import { CampaignDetails } from './entities/campaign-detail.entity';
import { ScheduleDto } from './dto/create-schedule.dto';
import { isUUID } from 'class-validator';

@Controller('campaign-details')
export class CampaignDetailsController {
  constructor(private readonly campaignDetailsService: CampaignDetailsService) {}

  @Post('create')
  create(@Body() createCampaignDetailDto: CreateCampaignDetailDto) {
    return this.campaignDetailsService.create(createCampaignDetailDto);
  }
  
  @Get(':id')
  async getCampaignById(@Param('id') id: string) {
  return this.campaignDetailsService.getCampaignById(id);
  }

  @Get()
  findAll() {
    return this.campaignDetailsService.findAll();
  }

  @Get('latest')
  findLatest() {
    return this.campaignDetailsService.findLatest();
  }

  @Get('templates')
  getTemplates() {
    return this.campaignDetailsService.getAllTemplates();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignDetailsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCampaignDetailDto: UpdateCampaignDetailDto) {
    return this.campaignDetailsService.update(id, updateCampaignDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignDetailsService.remove(id);
  }

  @Post('send-email')
  async sendEmail(@Body() body: SendMailDto) {
    const { to, subject, html } = body;
    return this.campaignDetailsService.sendCampaignEmail(to, subject, html);
  }

   @Post('schedule-email')
  async scheduleEmail(@Body() dto: ScheduleDto) {
  try {
    const scheduled = await this.campaignDetailsService.scheduleCampaignEmail(
      dto.to, dto.subject, dto.html, dto.scheduledAt, dto.timeZone
    );

    return {
      success: true,
      message: "Email scheduled successfully",
      data: scheduled,
    };
  } catch (err) {
    console.error("❌ Backend error scheduling email:", err);
    throw new HttpException("Failed to schedule email", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

  @Post('save-draft')
  async saveDraft(@Body() dto: SaveDraftDto) {
    return this.campaignDetailsService.saveDraft(dto);
  }

@Get('latest-draft')
  async getLatestDraft() {
    const draft = await this.campaignDetailsService.findLatestDraft();
    return draft;
  }
    @Get()
  async getAllCampaigns() {
    const campaigns = await this.campaignDetailsService.getAllCampaigns();
    return campaigns.map(camp => ({
      ...camp,
      statusLabel:
        camp.status === 'send'
          ? 'Sent'
          : camp.status === 'schedule'
          ? 'Scheduled'
          : 'Draft',
    }));
  }


}

@Controller('objective-master')
export class ObjectiveMasterController {
  constructor(private readonly campaignDetailsService: CampaignDetailsService) {}

  @Get('objective')
  async getAllObjectives() {
    return this.campaignDetailsService.fetchAll();
  }

  @Get('template/:objectiveId')
  async getTemplate(@Param('objectiveId', ParseIntPipe) objectiveId: number) {
    return this.campaignDetailsService.getTemplateByObjectiveId(objectiveId);
  }
}
