import { Test, TestingModule } from '@nestjs/testing';
import { CampaignDetailsController } from './campaign-details.controller';
import { CampaignDetailsService } from './campaign-details.service';

describe('CampaignDetailsController', () => {
  let controller: CampaignDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignDetailsController],
      providers: [CampaignDetailsService],
    }).compile();

    controller = module.get<CampaignDetailsController>(CampaignDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
