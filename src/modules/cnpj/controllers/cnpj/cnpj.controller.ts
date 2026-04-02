import { Controller, Post } from '@nestjs/common';
import { CnpjSyncService } from '../../services/cnpj-sync/cnpj-sync.service';

@Controller('cnpj')
export class CnpjController {
  constructor(private readonly service: CnpjSyncService) {}

  /**
   * executa manualmente
   */
  @Post('sync')
  async sync() {
    return this.service.syncLatest();
  }
}
