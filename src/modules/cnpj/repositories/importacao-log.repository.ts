import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ImportacaoLog, ImportacaoStatus } from '@prisma/client';

@Injectable()
export class ImportacaoLogRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    arquivo: string,
    pasta: string,
    tabela: string,
  ): Promise<ImportacaoLog> {
    return this.prisma.importacaoLog.create({
      data: {
        arquivo,
        pasta,
        tabela,
        status: ImportacaoStatus.IMPORTANDO,
      },
    });
  }

  async findByArquivoPasta(
    arquivo: string,
    pasta: string,
  ): Promise<ImportacaoLog | null> {
    return this.prisma.importacaoLog.findUnique({
      where: {
        arquivo_pasta: {
          arquivo,
          pasta,
        },
      },
    });
  }

  async markSucesso(
    logId: number,
    totalRegistros: number,
  ): Promise<ImportacaoLog> {
    return this.prisma.importacaoLog.update({
      where: { id: logId },
      data: {
        status: ImportacaoStatus.SUCESSO,
        totalRegistros,
        finalizadoEm: new Date(),
      },
    });
  }

  async markErro(logId: number, erro: string): Promise<ImportacaoLog> {
    return this.prisma.importacaoLog.update({
      where: { id: logId },
      data: {
        status: ImportacaoStatus.ERRO,
        erroMensagem: erro,
        finalizadoEm: new Date(),
      },
    });
  }

  async findByStatus(
    status: ImportacaoStatus,
  ): Promise<ImportacaoLog[]> {
    return this.prisma.importacaoLog.findMany({
      where: { status },
    });
  }

  async findByArquivoAndStatus(
    arquivo: string,
    pasta: string,
    status: ImportacaoStatus,
  ): Promise<ImportacaoLog | null> {
    return this.prisma.importacaoLog.findFirst({
      where: {
        arquivo,
        pasta,
        status,
      },
    });
  }

  async updateStatus(
    logId: number,
    status: 'IMPORTANDO' | 'SUCESSO' | 'ERRO' | 'PENDENTE',
  ): Promise<ImportacaoLog> {
    const statusEnum = ImportacaoStatus[status as keyof typeof ImportacaoStatus];
    return this.prisma.importacaoLog.update({
      where: { id: logId },
      data: {
        status: statusEnum,
      },
    });
  }
}
