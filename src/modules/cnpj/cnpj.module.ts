import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../../prisma/prisma.module';
import { CnpjSyncService } from '../cnpj/services/cnpj-sync/cnpj-sync.service';
import { CnpjDownloadService } from '../cnpj/services/cnpj-download/cnpj-download.service';
import { CnpjExtractService } from '../cnpj/services/cnpj-extract/cnpj-extract.service';
import { CnpjFolderService } from '../cnpj/services/cnpj-folder/cnpj-folder.service';
import { CnpjImportService } from '../cnpj/services/cnpj-import/cnpj-import.service';
import { CnpjController } from '../cnpj/controllers/cnpj/cnpj.controller';
import {
  EmpresaRepository,
  EstabelecimentoRepository,
  SocioRepository,
  DadosSimpleRepository,
  NaturaJuridicaRepository,
  PaisRepository,
  MunicipioRepository,
  CnaeRepository,
  ImportacaoLogRepository,
  EstabelecimentoCnaeRepository,
} from './repositories';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  providers: [
    CnpjSyncService,
    CnpjDownloadService,
    CnpjExtractService,
    CnpjFolderService,
    CnpjImportService,
    EmpresaRepository,
    EstabelecimentoRepository,
    SocioRepository,
    DadosSimpleRepository,
    NaturaJuridicaRepository,
    PaisRepository,
    MunicipioRepository,
    CnaeRepository,
    ImportacaoLogRepository,
    EstabelecimentoCnaeRepository,
  ],
  controllers: [CnpjController],
  exports: [CnpjSyncService],
})
export class CnpjModule {}
