import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { DadosSimples, Prisma } from '@prisma/client';

@Injectable()
export class DadosSimpleRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.DadosSimplesCreateInput): Promise<DadosSimples> {
    return this.prisma.dadosSimples.create({
      data,
    });
  }

  async createMany(
    data: Prisma.DadosSimplesCreateManyInput[],
    skipDuplicates = true,
    tx?: Prisma.TransactionClient,
  ): Promise<Prisma.BatchPayload> {
    const client = (tx ?? this.prisma) as any;
    return client.dadosSimples.createMany({
      data,
      skipDuplicates,
    });
  }

  async findByCnpjBasico(cnpjBasico: number): Promise<DadosSimples | null> {
    return this.prisma.dadosSimples.findUnique({
      where: { cnpjBasico },
    });
  }

  async count(): Promise<number> {
    return this.prisma.dadosSimples.count();
  }
}
