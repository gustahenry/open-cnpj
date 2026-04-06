import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Estabelecimento, Prisma } from '@prisma/client';

@Injectable()
export class EstabelecimentoRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Prisma.EstabelecimentoCreateInput,
  ): Promise<Estabelecimento> {
    return this.prisma.estabelecimento.create({
      data,
    });
  }

  async createMany(
    data: Prisma.EstabelecimentoCreateManyInput[],
    skipDuplicates = true,
    tx?: Prisma.TransactionClient,
  ): Promise<Prisma.BatchPayload> {
    const client = (tx ?? this.prisma) as any;
    return client.estabelecimento.createMany({
      data,
      skipDuplicates,
    });
  }

  async findByCnpj(
    cnpjBasico: number,
    cnpjOrdem: number,
    cnpjDv: number,
  ): Promise<Estabelecimento | null> {
    return this.prisma.estabelecimento.findUnique({
      where: {
        cnpjBasico_cnpjOrdem_cnpjDv: {
          cnpjBasico,
          cnpjOrdem,
          cnpjDv,
        },
      },
    });
  }

  async findMany(
    skip?: number,
    take?: number,
    where?: Prisma.EstabelecimentoWhereInput,
  ): Promise<Estabelecimento[]> {
    return this.prisma.estabelecimento.findMany({
      where,
      skip,
      take,
    });
  }

  async count(): Promise<number> {
    return this.prisma.estabelecimento.count();
  }
}
