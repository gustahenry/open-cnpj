import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { EstabelecimentoCnae, Prisma } from '@prisma/client';

@Injectable()
export class EstabelecimentoCnaeRepository {
  constructor(private prisma: PrismaService) {}

  async createMany(
    data: {
      cnpjBasico: number;
      cnpjOrdem: number;
      cnpjDv: number;
      codigoCnae: number;
      isPrincipal: boolean;
    }[],
    skipDuplicates = true,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = (tx ?? this.prisma) as any;

    // Inserir usando raw query para fazer o join com a tabela de estabelecimentos
    for (const item of data) {
      try {
        await client.$executeRaw`
          INSERT INTO estabelecimento_cnae (estabelecimentoId, cnaeId, "isPrincipal", "createdAt")
          SELECT e.id, c.id, ${item.isPrincipal}, NOW()
          FROM estabelecimento e
          JOIN cnae c ON c.codigo = ${item.codigoCnae}
          WHERE e."cnpjBasico" = ${item.cnpjBasico}
            AND e."cnpjOrdem" = ${item.cnpjOrdem}
            AND e."cnpjDv" = ${item.cnpjDv}
          ON CONFLICT ("estabelecimentoId", "cnaeId") DO NOTHING
        `;
      } catch (error) {
        // Ignorar erros de duplicação se skipDuplicates for true
        if (!skipDuplicates) {
          throw error;
        }
      }
    }
  }
}
