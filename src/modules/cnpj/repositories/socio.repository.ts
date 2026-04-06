import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Socio, Prisma } from '@prisma/client';

@Injectable()
export class SocioRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.SocioCreateInput): Promise<Socio> {
    return this.prisma.socio.create({
      data,
    });
  }

  async createMany(
    data: Prisma.SocioCreateManyInput[],
    skipDuplicates = true,
    tx?: Prisma.TransactionClient,
  ): Promise<Prisma.BatchPayload> {
    const client = (tx ?? this.prisma) as any;
    return client.socio.createMany({
      data,
      skipDuplicates,
    });
  }

  async findMany(
    skip?: number,
    take?: number,
    where?: Prisma.SocioWhereInput,
  ): Promise<Socio[]> {
    return this.prisma.socio.findMany({
      where,
      skip,
      take,
    });
  }

  async findByCnpjBasico(cnpjBasico: number): Promise<Socio[]> {
    return this.prisma.socio.findMany({
      where: { cnpjBasico },
    });
  }

  async count(): Promise<number> {
    return this.prisma.socio.count();
  }
}
