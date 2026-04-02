import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CnpjDownloadService } from '../cnpj-download/cnpj-download.service';
import { CnpjExtractService } from '../cnpj-extract/cnpj-extract.service';
import { CnpjFolderService } from '../cnpj-folder/cnpj-folder.service';

@Injectable()
export class CnpjSyncService {
  private readonly logger = new Logger(CnpjSyncService.name);

  constructor(
    private readonly downloadService: CnpjDownloadService,
    private readonly extractService: CnpjExtractService,
    private readonly folderService: CnpjFolderService,
  ) {}

  @Cron('0 3 10 * *')
  async sync(folder?: string) {
    if (!folder) folder = this.folderService.getPreviousMonth();

    this.folderService.ensureFolders(folder);

    this.logger.log(`Iniciando download e extração para ${folder}...`);

    const files = await this.downloadService.listAndDownload(folder);
    this.logger.log(`Download finalizado. Total de arquivos: ${files.length}`);

    await this.extractService.extractAll(folder);
    this.logger.log(`Extração finalizada para ${folder}`);

    return { folder, totalFiles: files.length };
  }

  @Cron('0 3 10 * *')
  async syncLatest() {
    return this.sync();
  }
}
