import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { parseStringPromise } from 'xml2js';
import { CnpjFolderService } from '../cnpj-folder/cnpj-folder.service';

const SHARE_TOKEN = 'YggdBLfdninEJX9';
const BASE_URL = 'https://arquivos.receitafederal.gov.br';
const WEBDAV_URL = `${BASE_URL}/public.php/webdav`;

@Injectable()
export class CnpjDownloadService {
  private readonly logger = new Logger(CnpjDownloadService.name);

  constructor(private readonly folderService: CnpjFolderService) {}

  async listAndDownload(folder?: string): Promise<string[]> {
    if (!folder) {
      folder = this.folderService.getPreviousMonth();
    }

    this.folderService.ensureFolders(folder);

    const files = await this.listFiles(folder);
    for (const file of files) {
      await this.downloadFile(folder, file);
    }
    return files;
  }

  private async listFiles(folder: string): Promise<string[]> {
    const xml = await this.propfind(`/${folder}/`);
    const parsed = await parseStringPromise(xml);
    const responses = parsed['d:multistatus']['d:response'];

    return responses
      .map((r: any) => r['d:href'][0].split('/').pop() ?? '')
      .filter((name) => name.endsWith('.zip'));
  }

  private async downloadFile(folder: string, filename: string) {
    const url = `${WEBDAV_URL}/${folder}/${filename}`;
    const dest = path.join(`storage/cnpj/${folder}/zip`, filename);
    fs.mkdirSync(path.dirname(dest), { recursive: true });

    if (fs.existsSync(dest)) {
      this.logger.log(`Arquivo já existe: ${filename}`);
      return;
    }

    const response = await axios.get(url, {
      responseType: 'stream',
      headers: {
        Authorization: `Basic ${Buffer.from(SHARE_TOKEN + ':').toString('base64')}`,
      },
    });

    const total = response.headers['content-length']
      ? parseInt(response.headers['content-length'], 10)
      : undefined;
    let downloaded = 0;

    await new Promise<void>((resolve, reject) => {
      const writer = fs.createWriteStream(dest);

      response.data.on('data', (chunk: Buffer) => {
        downloaded += chunk.length;
        if (total) {
          const percent = (downloaded / total) * 100;
          this.logger.log(`${filename} - ${percent.toFixed(2)}% baixado`);
        }
      });

      response.data.pipe(writer);

      writer.on('finish', () => resolve());
      writer.on('error', (err) => reject(err));
    });
    this.logger.log(`Download finalizado: ${filename}`);
  }

  private async propfind(davPath: string): Promise<string> {
    const response = await axios.request({
      method: 'PROPFIND',
      url: `${WEBDAV_URL}${davPath}`,
      headers: {
        Authorization: `Basic ${Buffer.from(SHARE_TOKEN + ':').toString('base64')}`,
        Depth: '1',
        'Content-Type': 'application/xml',
      },
      data: `<?xml version="1.0"?><d:propfind xmlns:d="DAV:"><d:prop><d:displayname/><d:resourcetype/><d:getcontentlength/></d:prop></d:propfind>`,
    });
    return response.data;
  }
}
