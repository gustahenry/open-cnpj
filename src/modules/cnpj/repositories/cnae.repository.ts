import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Cnae, Prisma } from '@prisma/client';

@Injectable()
export class CnaeRepository {
  constructor(private prisma: PrismaService) {}

  async createMany(
    data: Prisma.CnaeCreateManyInput[],
    skipDuplicates = true,
    tx?: Prisma.TransactionClient,
  ): Promise<Prisma.BatchPayload> {
    const client = (tx ?? this.prisma) as any;
    return client.cnae.createMany({
      data,
      skipDuplicates,
    });
  }

  async findByCodigo(codigo: number): Promise<Cnae | null> {
    return this.prisma.cnae.findUnique({
      where: { codigo },
    });
  }

  async count(): Promise<number> {
    return this.prisma.cnae.count();
  }
}
