import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { NaturaJuridica, Prisma } from '@prisma/client';

@Injectable()
export class NaturaJuridicaRepository {
  constructor(private prisma: PrismaService) {}

  async createMany(
    data: Prisma.NaturaJuridicaCreateManyInput[],
    skipDuplicates = true,
    tx?: Prisma.TransactionClient,
  ): Promise<Prisma.BatchPayload> {
    const client = (tx ?? this.prisma) as any;
    return client.naturaJuridica.createMany({
      data,
      skipDuplicates,
    });
  }

  async findByCodigo(codigo: number): Promise<NaturaJuridica | null> {
    return this.prisma.naturaJuridica.findUnique({
      where: { codigo },
    });
  }

  async count(): Promise<number> {
    return this.prisma.naturaJuridica.count();
  }
}
