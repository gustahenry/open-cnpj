import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Empresa, Prisma } from '@prisma/client';

@Injectable()
export class EmpresaRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.EmpresaCreateInput): Promise<Empresa> {
    return this.prisma.empresa.create({
      data,
    });
  }

  async findByCnpjBasico(cnpjBasico: number): Promise<Empresa | null> {
    return this.prisma.empresa.findUnique({
      where: { cnpjBasico },
    });
  }

  async findMany(
    skip?: number,
    take?: number,
    where?: Prisma.EmpresaWhereInput,
  ): Promise<Empresa[]> {
    return this.prisma.empresa.findMany({
      where,
      skip,
      take,
    });
  }

  async update(
    cnpjBasico: number,
    data: Prisma.EmpresaUpdateInput,
  ): Promise<Empresa> {
    return this.prisma.empresa.update({
      where: { cnpjBasico },
      data,
    });
  }

  async delete(cnpjBasico: number): Promise<Empresa> {
    return this.prisma.empresa.delete({
      where: { cnpjBasico },
    });
  }

  async count(): Promise<number> {
    return this.prisma.empresa.count();
  }
}
