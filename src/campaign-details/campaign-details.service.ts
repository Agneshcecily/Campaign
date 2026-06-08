import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { CampaignDetails } from './entities/campaign-detail.entity';
import { CreateCampaignDetailDto } from './dto/create-campaign-detail.dto';
import { UpdateCampaignDetailDto } from './dto/update-campaign-detail.dto';
import { TemplateMaster } from './entities/templateMaster.entity';
import { ObjectiveMaster } from './entities/objective-master.entity';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { SaveDraftDto } from './dto/save-draft.dto';
import { Schedule } from './entities/schedule.entity';
import { isUUID } from 'class-validator';
dotenv.config();
@Injectable()
export class CampaignDetailsService {
  constructor(
    @InjectRepository(CampaignDetails)
    private readonly campaignRepo: Repository<CampaignDetails>,
    
    @InjectRepository(ObjectiveMaster)
    private readonly objectiveRepo: Repository<ObjectiveMaster>,

    @InjectRepository(TemplateMaster)
    private readonly templateRepo: Repository<TemplateMaster>,

    @InjectRepository(Schedule)
    private readonly scheduleRepo: Repository<Schedule>,
  ) {}

  async create(createCampaignDetailDto: CreateCampaignDetailDto): Promise<CampaignDetails> {
    const campaign = this.campaignRepo.create(createCampaignDetailDto);
    return await this.campaignRepo.save(campaign);
  }

  async findAll(): Promise<CampaignDetails[]> {
  return this.campaignRepo.find({
    order: { createdAt: 'DESC' },
    relations: ['objective', 'template', 'login'],
  });
}

async getCampaignById(id: string): Promise<CampaignDetails> {
  if (!isUUID(id)) {
    throw new BadRequestException('Invalid campaign ID');
  }

  const campaign = await this.campaignRepo.findOne({
    where: { id },
    relations: ['objective', 'template', 'login', 'schedule'], // include any related entities you need
  });

  if (!campaign) {
    throw new NotFoundException(`Campaign with ID ${id} not found`);
  }

  return campaign;
}



  async fetchAll(): Promise<ObjectiveMaster[]> {
    return this.objectiveRepo.find();
  }

   async findLatest(): Promise<CampaignDetails> {
    const latest = await this.campaignRepo.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });

    if (!latest || latest.length === 0) {
      throw new NotFoundException('No campaigns found');
    }

    return latest[0];
  }
   async findLatestDraft(): Promise<CampaignDetails> {
  const draft = await this.campaignRepo.findOne({
    where: { status: 'draft' },
    order: { createdAt: 'DESC' }, 
  });

  if (!draft) {
    throw new NotFoundException('No draft campaign found');
  }

  return draft;
}
   async getAllCampaigns(): Promise<CampaignDetails[]> {
    return this.campaignRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<CampaignDetails> {
    const campaign = await this.campaignRepo.findOne({
      where: { login: { id: id } },
      relations: ['objective', 'template', 'rule', 'Schedule'],
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return campaign;
  }
   
  async getTemplateByObjectiveId(objectiveId: number): Promise<string> {
  const templateRecord = await this.templateRepo.findOne({
    where: { obj: { id: objectiveId }, isActive: true },
  });

  if (!templateRecord) {
    throw new NotFoundException('Template not found for this objective');
  }

  return templateRecord.template;
}

  async update(id: string, updateCampaignDetailDto: UpdateCampaignDetailDto): Promise<CampaignDetails> {
    await this.campaignRepo.update(id, updateCampaignDetailDto);
    return this.findOne(id);
  }

 async remove(id: string) {
  if (!isUUID(id)) {
    throw new BadRequestException('Invalid campaign ID');
  }

  const campaign = await this.campaignRepo.findOne({
    where: { id },
  });

  if (!campaign) {
    throw new NotFoundException('Campaign not found');
  }

  await this.campaignRepo.remove(campaign);
  return { message: 'Campaign deleted successfully' };
}


  async getAllTemplates(): Promise<TemplateMaster[]> {
    return await this.templateRepo.find();
  }

  async sendCampaignEmail(to: string[], subject: string, html: string): Promise<any> {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"Your Brand" <${process.env.GMAIL_USER}>`,
      to: to.join(','),
      subject,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: error.message };
  }
}
async saveDraft(dto: SaveDraftDto): Promise<CampaignDetails> {
  const {
    id,
    campName,
    senderName,
    senderEmail,
    subject,
    description,
    objectiveId,
    templateId,
    selectedAudienceIds,
    selectedTemplateHtml,
    deliveryMethod,
    selectedTimeZone,
    targetRules,
    step,
    status = 'draft',
  } = dto;

  let campaign: CampaignDetails;

  if (id) {
const foundCampaign = await this.campaignRepo.findOne({ where: { id: String(id) } });
  if (!foundCampaign) throw new NotFoundException(`Campaign with ID ${id} not found`);
  campaign = foundCampaign;


  campaign.campName = campName ?? campaign.campName;
  campaign.senderName = senderName ?? campaign.senderName;
  campaign.senderEmail = senderEmail ?? campaign.senderEmail;
  campaign.subject = subject ?? campaign.subject;
  campaign.description = description ?? campaign.description;
  campaign.selectedAudienceIds = selectedAudienceIds ?? campaign.selectedAudienceIds;
  campaign.selectedTemplateHtml = selectedTemplateHtml ?? campaign.selectedTemplateHtml;
  campaign.deliveryMethod = deliveryMethod ?? campaign.deliveryMethod;
  campaign.selectedTimeZone = selectedTimeZone ?? campaign.selectedTimeZone;
  campaign.targetRules = targetRules ?? campaign.targetRules;
  campaign.step = step ?? campaign.step;
  campaign.status = status ?? campaign.status;

  if (objectiveId) {
    const objective = await this.objectiveRepo.findOne({ where: { id: Number(objectiveId) } });
    if (!objective) throw new NotFoundException('Objective not found');
    campaign.objective = objective;
  }

  if (templateId) {
    const template = await this.templateRepo.findOne({ where: { id: Number(templateId) } });
    if (!template) throw new NotFoundException('Template not found');
    campaign.template = template;
  }
}
 else {
    // Create new draft
    campaign = this.campaignRepo.create({
      campName,
      senderName,
      senderEmail,
      subject,
      description,
      selectedAudienceIds,
      selectedTemplateHtml,
      deliveryMethod,
      selectedTimeZone,
      targetRules,
      step,
      status,
    });

    if (objectiveId) {
      const objective = await this.objectiveRepo.findOne({ where: { id: Number(objectiveId) } });
      if (!objective) throw new NotFoundException('Objective not found');
      campaign.objective = objective;
    }

    if (templateId) {
      const template = await this.templateRepo.findOne({ where: { id: Number(templateId) } });
      if (!template) throw new NotFoundException('Template not found');
      campaign.template = template;
    }
  }

  return await this.campaignRepo.save(campaign);
}


 async scheduleCampaignEmail(
  to: string[],
  subject: string,
  html: string,
  scheduledAt: string,
  timeZone: string,
): Promise<Schedule> {
  const entry = this.scheduleRepo.create({
    to: to.join(','),
    subject,
    html,
    scheduledAt,
    timeZone,
    isSent: false,
  });

  return await this.scheduleRepo.save(entry);
}

async checkAndSendScheduledEmails(): Promise<void> {
  const now = new Date();

  const dueEmails = await this.scheduleRepo.find({
    where: {
      isSent: false,
      scheduledAt: LessThanOrEqual(now),
    },
  });

  for (const email of dueEmails) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: `"Your Brand" <${process.env.GMAIL_USER}>`,
        to: email.to,
        subject: email.subject,
        html: email.html,
      });

      email.isSent = true;
      await this.scheduleRepo.save(email);
    } catch (err) {
      console.error('Failed to send scheduled email:', err);
    }
  }
}
}