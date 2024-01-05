import { Test, TestingModule } from '@nestjs/testing';
import { EmbedConfigService } from '../services/embed-config.service';

describe('EmbedConfigService', () => {
  let service: EmbedConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmbedConfigService],
    }).compile();

    service = module.get<EmbedConfigService>(EmbedConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
