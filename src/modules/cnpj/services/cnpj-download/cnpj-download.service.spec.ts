import { Test, TestingModule } from '@nestjs/testing';
import { CnpjDownloadService } from './cnpj-download.service';

describe('CnpjDownloadService', () => {
  let service: CnpjDownloadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CnpjDownloadService],
    }).compile();

    service = module.get<CnpjDownloadService>(CnpjDownloadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
