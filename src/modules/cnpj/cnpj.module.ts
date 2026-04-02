import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CnpjSyncService } from '../cnpj/services/cnpj-sync/cnpj-sync.service';
import { CnpjDownloadService } from '../cnpj/services/cnpj-download/cnpj-download.service';
import { CnpjExtractService } from '../cnpj/services/cnpj-extract/cnpj-extract.service';
import { CnpjFolderService } from '../cnpj/services/cnpj-folder/cnpj-folder.service';
import { CnpjController } from '../cnpj/controllers/cnpj/cnpj.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [
    CnpjSyncService,
    CnpjDownloadService,
    CnpjExtractService,
    CnpjFolderService,
  ],
  controllers: [CnpjController],
  exports: [CnpjSyncService],
})
export class CnpjModule {}
