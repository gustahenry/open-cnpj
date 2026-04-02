import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as unzipper from 'unzipper';
import * as iconv from 'iconv-lite';

@Injectable()
export class CnpjExtractService {
  private readonly logger = new Logger(CnpjExtractService.name);

  async extractAll(folder: string) {
    const zipPath = `storage/cnpj/${folder}/zip`;
    const extractedPath = `storage/cnpj/${folder}/extracted`;

    fs.mkdirSync(extractedPath, { recursive: true });

    const zipFiles = fs.readdirSync(zipPath).filter((f) => f.endsWith('.zip'));

    for (const zipFile of zipFiles) {
      const fullZipPath = path.join(zipPath, zipFile);
      const csvFileName = path.basename(zipFile, '.zip') + '.csv';
      const csvPath = path.join(extractedPath, csvFileName);

      if (fs.existsSync(csvPath)) {
        this.logger.log(`${csvFileName} já existe, pulando...`);
        continue;
      }

      this.logger.log(`Extraindo ${zipFile} para ${csvFileName}...`);

      await new Promise<void>((resolve, reject) => {
        let totalBytes = 0;

        // Cria um writeStream para o CSV final
        const writeStream = fs.createWriteStream(csvPath);

        fs.createReadStream(fullZipPath)
          .pipe(unzipper.Parse())
          .on('entry', (entry: any) => {
            // Ignora diretórios
            if (entry.type === 'Directory') {
              entry.autodrain();
              return;
            }

            const totalSize = entry.vars.uncompressedSize;
            let extractedBytes = 0;

            entry.on('data', (chunk: Buffer) => {
              extractedBytes += chunk.length;
              totalBytes += chunk.length;

              const percent = (extractedBytes / totalSize) * 100;
              this.logger.log(
                `${csvFileName} - ${percent.toFixed(2)}% extraído`,
              );
            });

            // Concatena o conteúdo do CSV interno no CSV final (convertendo ISO-8859-1 para UTF-8)
            entry
              .pipe(iconv.decodeStream('iso-8859-1'))
              .pipe(iconv.encodeStream('utf8'))
              .pipe(writeStream, { end: false })
              .on('error', (err) => reject(err));
          })
          .on('close', () => {
            writeStream.end();
            this.logger.log(
              `Extração finalizada: ${csvFileName}, ${totalBytes} bytes extraídos`,
            );
            resolve();
          })
          .on('error', (err) => reject(err));
      });
    }
  }
}
