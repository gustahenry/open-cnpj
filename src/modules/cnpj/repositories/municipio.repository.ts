import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Municipio, Prisma } from '@prisma/client';

@Injectable()
export class MunicipioRepository {
  constructor(private prisma: PrismaService) {}

  async createMany(
    data: Prisma.MunicipioCreateManyInput[],
    skipDuplicates = true,
    tx?: Prisma.TransactionClient,
  ): Promise<Prisma.BatchPayload> {
    const client = (tx ?? this.prisma) as any;
    return client.municipio.createMany({
      data,
      skipDuplicates,
    });
  }

  async findByCodigo(codigo: number): Promise<Municipio | null> {
    return this.prisma.municipio.findUnique({
      where: { codigo },
    });
  }

  async count(): Promise<number> {
    return this.prisma.municipio.count();
  }
}
