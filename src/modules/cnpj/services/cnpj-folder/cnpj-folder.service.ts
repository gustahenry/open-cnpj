import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class CnpjFolderService {
  private readonly logger = new Logger(CnpjFolderService.name);

  getPreviousMonth(): string {
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  ensureFolders(folder: string): boolean {
    const zipPath = `storage/cnpj/${folder}/zip`;
    const extractedPath = `storage/cnpj/${folder}/extracted`;

    if (fs.existsSync(extractedPath)) {
      this.logger.warn(
        `Dataset ${folder} já existe, pulando download e extração`,
      );
      return false;
    }

    fs.mkdirSync(zipPath, { recursive: true });
    fs.mkdirSync(extractedPath, { recursive: true });
    return true;
  }
}
