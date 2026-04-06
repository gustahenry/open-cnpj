import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import Papa from 'papaparse';
import { PrismaService } from '../../../../prisma/prisma.service';
import { EmpresaRepository } from '../../repositories/empresa.repository';
import { EstabelecimentoRepository } from '../../repositories/estabelecimento.repository';
import { SocioRepository } from '../../repositories/socio.repository';
import { DadosSimpleRepository } from '../../repositories/dados-simples.repository';
import { ImportacaoLogRepository } from '../../repositories/importacao-log.repository';
import { NaturaJuridicaRepository } from '../../repositories/natureza-juridica.repository';
import { PaisRepository } from '../../repositories/pais.repository';
import { MunicipioRepository } from '../../repositories/municipio.repository';
import { CnaeRepository } from '../../repositories/cnae.repository';
import { EstabelecimentoCnaeRepository } from '../../repositories/estabelecimento-cnae.repository';

@Injectable()
export class CnpjImportService {
  private readonly logger = new Logger(CnpjImportService.name);

  constructor(
    private prisma: PrismaService,
    private empresaRepository: EmpresaRepository,
    private estabelecimentoRepository: EstabelecimentoRepository,
    private socioRepository: SocioRepository,
    private dadosSimpleRepository: DadosSimpleRepository,
    private importacaoLogRepository: ImportacaoLogRepository,
    private naturaJuridicaRepository: NaturaJuridicaRepository,
    private paisRepository: PaisRepository,
    private municipioRepository: MunicipioRepository,
    private cnaeRepository: CnaeRepository,
    private estabelecimentoCnaeRepository: EstabelecimentoCnaeRepository,
  ) {}

  // Ordem de importação respeitando dependências
  private readonly importOrder = [
    // 1. Tabelas de domínio (lookup tables) - sem dependências
    'Naturezas',
    'Paises',
    'Municipios',
    'Cnaes',
    'Qualificacoes',
    'Motivos',
    // 2. Empresas (depende de Naturezas)
    'Empresas',
    // 3. Estabelecimentos (depende de Empresas e Municipios)
    // 'Estabelecimentos',
    // 4. Socios (depende de Empresas e Qualificacoes)
    // 'Socios',
    // 5. Dados complementares
    // 'Simples',
  ];

  async importAll(folder: string) {
    const extractedPath = `storage/cnpj/${folder}/extracted`;

    const allFiles = fs
      .readdirSync(extractedPath)
      .filter((f) => f.endsWith('.csv'));

    // Ordena os arquivos conforme definido em importOrder
    const csvFiles = this.sortFilesByOrder(allFiles);

    this.logger.log(
      `Iniciando importação de ${csvFiles.length} arquivo(s) da pasta ${folder}`,
    );
    this.logger.log(`Ordem: ${csvFiles.join(', ')}`);

    for (const file of csvFiles) {
      const logExistente =
        await this.importacaoLogRepository.findByArquivoPasta(file, folder);

      if (logExistente?.status === 'SUCESSO') {
        this.logger.log(`⏭️  Pulando ${file} - já foi importado com sucesso`);
        continue;
      }

      await this.importFile(path.join(extractedPath, file), file, folder);
    }

    this.logger.log(`✅ Importação de ${folder} finalizada`);
  }

  private sortFilesByOrder(files: string[]): string[] {
    // Filtra apenas os arquivos que têm prefixo em importOrder (ignorando os desativados)
    const activeFiles = files.filter((f) =>
      this.importOrder.some((prefix) => f.startsWith(prefix)),
    );

    return activeFiles.sort((a, b) => {
      const getPrefix = (fileName: string) => {
        const prefix = this.importOrder.find((p) => fileName.startsWith(p));
        return prefix ? this.importOrder.indexOf(prefix) : Infinity;
      };

      const orderA = getPrefix(a);
      const orderB = getPrefix(b);

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // Se mesmo prefixo, ordena alfabeticamente (ex: Naturezas0.csv, Naturezas1.csv)
      return a.localeCompare(b);
    });
  }

  private tableMap = {
    Cnaes: 'cnaes',
    Empresas: 'empresas',
    Estabelecimentos: 'estabelecimentos',
    Motivos: 'motivos',
    Municipios: 'municipios',
    Naturezas: 'naturezas',
    Paises: 'paises',
    Qualificacoes: 'qualificacoes',
    Simples: 'simples',
    Socios: 'socios',
  };

  private resolveTable(fileName: string) {
    const key = Object.keys(this.tableMap).find((k) => fileName.startsWith(k));

    if (!key) {
      throw new Error(`Arquivo não mapeado: ${fileName}`);
    }

    return this.tableMap[key];
  }

  private async importFile(filePath: string, fileName: string, folder: string) {
    const table = this.resolveTable(fileName);

    this.logger.log(`📥 Iniciando importação: ${fileName} -> tabela ${table}`);

    let logId: number | null = null;

    try {
      // Criar ou obter log de importação
      let log = await this.importacaoLogRepository.findByArquivoPasta(
        fileName,
        folder,
      );

      if (!log) {
        // Log não existe, criar novo
        log = await this.importacaoLogRepository.create(
          fileName,
          folder,
          table,
        );
      } else {
        // Log existe, atualizar status para IMPORTANDO
        log = await this.importacaoLogRepository.updateStatus(
          log.id,
          'IMPORTANDO',
        );
      }

      logId = log!.id;

      let totalRows = 0;
      const batchSize = 10000; // Reduzido para 10k - equilíbrio entre memória e conexões
      const chunkSize = 64 * 1024; // 64KB - tamanho do chunk de processamento
      let batch: any[] = [];
      let insertPromise: Promise<void> | null = null;
      let parseError: unknown = null;
      let lastProgressLog = 0;
      let batchesInserted = 0;
      let insertsPending = 0;
      const startTime = Date.now();
      const MAX_CONCURRENT_INSERTS = 1; // Apenas 1 inserção por vez para evitar esgotamento de pool

      const importPromise = new Promise<number>((resolve, reject) => {
        // highWaterMark aumentado para 1MB para melhor performance em arquivos grandes
        const stream = fs.createReadStream(filePath, {
          encoding: 'utf-8',
          highWaterMark: 1024 * 1024, // 1MB
        });

        Papa.parse(stream, {
          delimiter: ';',
          skipEmptyLines: true,
          chunkSize: chunkSize,
          error: (error: any) => {
            parseError = error;
            this.logger.error(
              `Erro ao fazer parse do arquivo ${fileName}: ${error.message}`,
            );
            reject(error);
          },
          complete: async () => {
            try {
              // Aguardar última inserção
              if (insertPromise) {
                await insertPromise;
                insertPromise = null;
              }

              // Aguardar qualquer inserção pendente
              let waitCount = 0;
              while (insertsPending > 0 && waitCount < 300) {
                await new Promise((r) => setTimeout(r, 100));
                waitCount++;
              }

              if (insertsPending > 0) {
                throw new Error(
                  `Timeout aguardando ${insertsPending} inserções pendentes`,
                );
              }

              // Inserir os registros restantes no batch
              if (batch.length > 0) {
                const batchToInsert = batch;
                batch = [];
                batchesInserted++;

                try {
                  await this.insertBatchInTransaction(table, batchToInsert);
                  const elapsedSeconds = (
                    (Date.now() - startTime) /
                    1000
                  ).toFixed(1);
                  this.logger.log(
                    `📦 ${fileName} - Batch final #${batchesInserted} inserido (${batchToInsert.length} registros) em ${elapsedSeconds}s`,
                  );
                } catch (error) {
                  const errorMessage =
                    error instanceof Error
                      ? error.message.split('\n')[0]
                      : 'Erro desconhecido';
                  this.logger.error(
                    `❌ Erro ao inserir batch final em ${fileName}: ${errorMessage}`,
                  );
                  throw error;
                }
              }

              const totalSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
              const avgRecordsPerSecond = (
                totalRows /
                ((Date.now() - startTime) / 1000)
              ).toFixed(0);
              this.logger.log(
                `✅ Importação finalizada: ${fileName} - ${totalRows} registros em ${totalSeconds}s (média ${avgRecordsPerSecond} rec/s)`,
              );

              // Liberar memória explicitamente
              batch = [];
              if (global.gc) {
                global.gc();
              }

              resolve(totalRows);
            } catch (error) {
              reject(error);
            }
          },
          chunk: async (chunk: any) => {
            // Processar cada chunk de dados
            if (parseError) return;

            try {
              for (const row of chunk.data) {
                // Aguardar se há muitas inserções pendentes
                while (insertsPending >= MAX_CONCURRENT_INSERTS && !parseError) {
                  await new Promise((r) => setTimeout(r, 50));
                }

                if (parseError) return;

                batch.push(this.mapRow(table, row));
                totalRows++;

                // Log de progresso a cada 50k registros
                if (totalRows - lastProgressLog >= 50000) {
                  const elapsedSeconds = (
                    (Date.now() - startTime) /
                    1000
                  ).toFixed(1);
                  const recordsPerSecond = (
                    totalRows /
                    ((Date.now() - startTime) / 1000)
                  ).toFixed(0);
                  this.logger.log(
                    `⏳ ${fileName} - ${totalRows} registros | ${elapsedSeconds}s decorridos | ${recordsPerSecond} rec/s`,
                  );
                  lastProgressLog = totalRows;

                  // GC a cada 50k registros processados
                  if (global.gc) {
                    global.gc();
                  }

                  // Log de memória
                  if (global.gc && process.memoryUsage) {
                    const mem = process.memoryUsage();
                    const used = Math.round(mem.heapUsed / 1024 / 1024);
                    this.logger.debug(`💾 Memória: ${used}MB`);
                  }
                }

                // Executar inserção em background quando batch está cheio
                if (batch.length >= batchSize) {
                  const batchToInsert = batch;
                  batch = [];
                  batchesInserted++;

                  insertsPending++;

                  // Iniciar inserção sem bloquear o parsing
                  insertPromise = this.insertBatchInTransaction(
                    table,
                    batchToInsert,
                  )
                    .then(() => {
                      insertsPending--;
                      const elapsedSeconds = (
                        (Date.now() - startTime) /
                        1000
                      ).toFixed(1);
                      this.logger.log(
                        `📦 ${fileName} - Batch #${batchesInserted} inserido (${batchToInsert.length} registros) em ${elapsedSeconds}s`,
                      );

                      // SEMPRE forçar GC após inserção para liberar memória imediatamente
                      if (global.gc) {
                        global.gc();
                      }

                      // Delay maior para dar tempo do GC rodar (50ms)
                      return new Promise<void>((r) => setTimeout(r, 50));
                    })
                    .catch((error) => {
                      insertsPending--;
                      // Extrair apenas a primeira linha da mensagem de erro
                      let errorMessage = 'Erro desconhecido';
                      if (error instanceof Error) {
                        errorMessage = error.message.split('\n')[0];
                      }

                      this.logger.error(
                        `❌ Erro ao inserir batch em ${fileName}: ${errorMessage}`,
                      );
                      parseError = error;
                      reject(error);
                    });
                }
              }
            } catch (error) {
              reject(error);
            }
          },
        });
      });

      totalRows = await importPromise;

      // Sucesso: atualizar log
      if (logId) {
        await this.importacaoLogRepository.markSucesso(logId, totalRows);
      }
    } catch (error) {
      // Erro: atualizar log e falhar
      const mensagem = error instanceof Error ? error.message : String(error);
      if (logId) {
        await this.importacaoLogRepository.markErro(logId, mensagem);
      }
      this.logger.error(`❌ Erro na importação: ${fileName} - ${mensagem}`);
      throw error;
    }
  }

  private async insertBatchInTransaction(table: string, rows: any[]) {
    try {
      this.logger.debug(
        `Iniciando inserção de ${rows.length} registros na tabela ${table}`,
      );

      // Inserir sem transação para verificar se funciona
      const result = await this.insertBatch(table, rows, undefined);

      this.logger.debug(
        `Inserção bem-sucedida de ${rows.length} registros em ${table}`,
      );
      return result;
    } catch (error) {
      // Extrair apenas a mensagem de erro sem exibir os dados completos
      let errorMessage = 'Erro desconhecido';
      let stack = '';

      if (error instanceof Error) {
        const message = error.message;
        const relevantPart = message.split('data:')[0] || message;
        // Se for timeout de pool, adicionar contexto
        if (message.includes('connection pool')) {
          errorMessage = 'Pool de conexões esgotado - aumentar connection_limit no banco';
        } else {
          errorMessage = relevantPart.substring(0, 500).trim();
        }
        stack = error.stack?.substring(0, 300) || '';
      }

      this.logger.error(
        `Erro ao inserir na tabela ${table} (batch com ${rows.length} registros): ${errorMessage} ${stack}`,
      );
      throw error;
    }
  }

  private mapRow(table: string, row: any) {
    switch (table) {
      case 'cnaes':
        return {
          codigo: parseInt(row[0]),
          descricao: row[1],
        };

      case 'empresas':
        return {
          cnpjBasico: parseInt(row[0]),
          razaoSocial: row[1],
          naturezaJuridicaCodigo: parseInt(row[2]),
          qualificacaoResponsavel: row[3] || null,
          capitalSocial: row[4] || null,
          porteEmpresaCodigo: row[5] ? parseInt(row[5]) : null,
          enteFederativoResponsavel: row[6] || null,
        };

      case 'estabelecimentos':
        return {
          cnpjBasico: parseInt(row[0]),
          cnpjOrdem: parseInt(row[1]),
          cnpjDv: parseInt(row[2]),
          identificadorMatrizFilialCodigo: parseInt(row[3]),
          nomeFantasia: row[4] || null,
          situacaoCadastralCodigo: parseInt(row[5]),
          dataSituacaoCadastral: row[6] ? new Date(row[6]) : null,
          motivoSituacaoCadastralCodigo: row[7] ? parseInt(row[7]) : null,
          nomeCidadeExterior: row[8] || null,
          paisCodigo: row[9] ? parseInt(row[9]) : null,
          dataInicioAtividade: row[10] ? new Date(row[10]) : null,
          tipoLogradouro: row[13] || null,
          logradouro: row[14] || null,
          numero: row[15] || null,
          complemento: row[16] || null,
          bairro: row[17] || null,
          cep: row[18] || null,
          uf: row[19] || null,
          municipioCodigo: row[20] ? parseInt(row[20]) : null,
          dddPrimario: row[21] ? parseInt(row[21]) : null,
          telefonePrimario: row[22] || null,
          dddSecundario: row[23] ? parseInt(row[23]) : null,
          telefoneSecundario: row[24] || null,
          dddFax: row[25] ? parseInt(row[25]) : null,
          fax: row[26] || null,
          email: row[27] || null,
          situacaoEspecial: row[28] || null,
          dataSituacaoEspecial: row[29] ? new Date(row[29]) : null,
          // CNAEs serão processados separadamente
          _cnaePrincipal: row[11] ? parseInt(row[11]) : null,
          _cnaeSecundaria: row[12]
            ? row[12]
                .split(',')
                .map((c: string) => parseInt(c.trim()))
                .filter(Boolean)
            : [],
        };

      case 'motivos':
        return {
          codigo: parseInt(row[0]),
          descricao: row[1],
        };

      case 'municipios':
        return {
          codigo: parseInt(row[0]),
          descricao: row[1],
        };

      case 'naturezas':
        return {
          codigo: parseInt(row[0]),
          descricao: row[1],
        };

      case 'paises':
        return {
          codigo: parseInt(row[0]),
          descricao: row[1],
        };

      case 'qualificacoes':
        return {
          codigo: parseInt(row[0]),
          descricao: row[1],
        };

      case 'simples':
        return {
          cnpjBasico: parseInt(row[0]),
          opcaoSimples: row[1] ? row[1] === 'S' || row[1] === '1' : null,
          dataOpcaoSimples: row[2] ? new Date(row[2]) : null,
          dataExclusaoSimples: row[3] ? new Date(row[3]) : null,
          opcaoMei: row[4] ? row[4] === 'S' || row[4] === '1' : null,
          dataOpcaoMei: row[5] ? new Date(row[5]) : null,
          dataExclusaoMei: row[6] ? new Date(row[6]) : null,
        };

      case 'socios':
        return {
          cnpjBasico: parseInt(row[0]),
          identificadorSocioCodigo: parseInt(row[1]),
          nomeSocio: row[2],
          cnpjCpfSocio: row[3] || null,
          qualificacaoSocioCodigo: parseInt(row[4]),
          dataEntradaSociedade: row[5] ? new Date(row[5]) : null,
          paisCodigo: row[6] ? parseInt(row[6]) : null,
          representanteLegalCpf: row[7] || null,
          nomeRepresentanteLegal: row[8] || null,
          qualificacaoRepresentanteLegalCodigo: row[9]
            ? parseInt(row[9])
            : null,
          faixaEtaria: row[10] ? parseInt(row[10]) : null,
        };

      default:
        return row;
    }
  }

  private async insertBatch(table: string, rows: any[], tx?: any) {
    switch (table) {
      // Tabelas de domínio (lookup tables)
      case 'naturezas':
        await this.naturaJuridicaRepository.createMany(rows, true, tx);
        break;

      case 'paises':
        await this.paisRepository.createMany(rows, true, tx);
        break;

      case 'municipios':
        await this.municipioRepository.createMany(rows, true, tx);
        break;

      case 'cnaes':
        await this.cnaeRepository.createMany(rows, true, tx);
        break;

      // Tabelas principais (desativadas por enquanto)
      case 'empresas':
        await this.empresaRepository.createMany(rows, true, tx);
        break;

      case 'estabelecimentos':
        // Extrair CNAEs antes de inserir estabelecimentos
        const estabelecimentosCnaes: Array<{
          cnpjBasico: number;
          cnpjOrdem: number;
          cnpjDv: number;
          cnaePrincipal: number | null;
          cnaeSecundaria: number[];
        }> = [];

        const estabelecimentosLimpo = rows.map((row: any) => {
          estabelecimentosCnaes.push({
            cnpjBasico: row.cnpjBasico,
            cnpjOrdem: row.cnpjOrdem,
            cnpjDv: row.cnpjDv,
            cnaePrincipal: row._cnaePrincipal,
            cnaeSecundaria: row._cnaeSecundaria || [],
          });

          // Remover campos de CNAE antes de inserir
          const { _cnaePrincipal, _cnaeSecundaria, ...rowLimpo } = row;
          return rowLimpo;
        });

        // Inserir estabelecimentos
        await this.estabelecimentoRepository.createMany(
          estabelecimentosLimpo,
          true,
          tx,
        );

        // Inserir CNAEs (principal e secundários)
        const cnaesPaInserir: Array<{
          cnpjBasico: number;
          cnpjOrdem: number;
          cnpjDv: number;
          codigoCnae: number;
          isPrincipal: boolean;
        }> = [];

        for (const item of estabelecimentosCnaes) {
          if (item.cnaePrincipal) {
            cnaesPaInserir.push({
              cnpjBasico: item.cnpjBasico,
              cnpjOrdem: item.cnpjOrdem,
              cnpjDv: item.cnpjDv,
              codigoCnae: item.cnaePrincipal,
              isPrincipal: true,
            });
          }

          for (const secundario of item.cnaeSecundaria) {
            cnaesPaInserir.push({
              cnpjBasico: item.cnpjBasico,
              cnpjOrdem: item.cnpjOrdem,
              cnpjDv: item.cnpjDv,
              codigoCnae: secundario,
              isPrincipal: false,
            });
          }
        }

        if (cnaesPaInserir.length > 0) {
          await this.estabelecimentoCnaeRepository.createMany(
            cnaesPaInserir,
            true,
            tx,
          );
        }
        break;

      case 'socios':
        await this.socioRepository.createMany(rows, true, tx);
        break;

      case 'simples':
        await this.dadosSimpleRepository.createMany(rows, true, tx);
        break;

      default:
        this.logger.warn(`Tabela ${table} ainda não implementada`);
    }
  }
}
