import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      // Desabilitar logging do Prisma completamente
      log: [],
    });

    // Silenciar qualquer evento de log do Prisma
    this.$on('query' as never, () => {});
    this.$on('info' as never, () => {});
    this.$on('warn' as never, () => {});
    this.$on('error' as never, () => {});
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
