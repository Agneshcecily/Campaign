import { Test, TestingModule } from '@nestjs/testing';
import { CampaignDetailsService } from './campaign-details.service';

describe('CampaignDetailsService', () => {
  let service: CampaignDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CampaignDetailsService],
    }).compile();

    service = module.get<CampaignDetailsService>(CampaignDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
