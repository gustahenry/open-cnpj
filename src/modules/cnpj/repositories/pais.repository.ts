import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Pais, Prisma } from '@prisma/client';

@Injectable()
export class PaisRepository {
  constructor(private prisma: PrismaService) {}

  async createMany(
    data: Prisma.PaisCreateManyInput[],
    skipDuplicates = true,
    tx?: Prisma.TransactionClient,
  ): Promise<Prisma.BatchPayload> {
    const client = (tx ?? this.prisma) as any;
    return client.pais.createMany({
      data,
      skipDuplicates,
    });
  }

  async findByCodigo(codigo: number): Promise<Pais | null> {
    return this.prisma.pais.findUnique({
      where: { codigo },
    });
  }

  async count(): Promise<number> {
    return this.prisma.pais.count();
  }
}
