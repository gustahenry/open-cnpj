import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CnpjDownloadService } from '../cnpj-download/cnpj-download.service';
import { CnpjExtractService } from '../cnpj-extract/cnpj-extract.service';
import { CnpjFolderService } from '../cnpj-folder/cnpj-folder.service';
import { CnpjImportService } from '../cnpj-import/cnpj-import.service';

@Injectable()
export class CnpjSyncService {
  private readonly logger = new Logger(CnpjSyncService.name);

  constructor(
    private readonly downloadService: CnpjDownloadService,
    private readonly extractService: CnpjExtractService,
    private readonly folderService: CnpjFolderService,
    private readonly importService: CnpjImportService,
  ) {}

  @Cron('0 3 10 * *')
  async sync(folder?: string) {
    if (!folder) folder = this.folderService.getPreviousMonth();

    const startTime = Date.now();
    this.logger.log(`🚀 ============================================`);
    this.logger.log(`🚀 Iniciando sincronização para ${folder}`);
    this.logger.log(`🚀 ============================================`);

    this.folderService.ensureFolders(folder);

    this.logger.log(`📥 Iniciando download e extração para ${folder}...`);
    const downloadStart = Date.now();

    const files = await this.downloadService.listAndDownload(folder);
    const downloadTime = ((Date.now() - downloadStart) / 1000).toFixed(1);
    this.logger.log(`✅ Download finalizado em ${downloadTime}s. Total de arquivos: ${files.length}`);

    this.logger.log(`📦 Iniciando extração...`);
    const extractStart = Date.now();
    await this.extractService.extractAll(folder);
    const extractTime = ((Date.now() - extractStart) / 1000).toFixed(1);
    this.logger.log(`✅ Extração finalizada em ${extractTime}s`);

    this.logger.log(`💾 Iniciando importação dos arquivos...`);
    const importStart = Date.now();
    await this.importService.importAll(folder);
    const importTime = ((Date.now() - importStart) / 1000).toFixed(1);
    this.logger.log(`✅ Importação finalizada em ${importTime}s`);

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    this.logger.log(`🚀 ============================================`);
    this.logger.log(`🎉 Sincronização concluída em ${totalTime}s`);
    this.logger.log(`🚀 ============================================`);

    return { folder, totalFiles: files.length };
  }

  @Cron('0 3 10 * *')
  async syncLatest() {
    return this.sync();
  }
}
