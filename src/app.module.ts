import { Module } from '@nestjs/common';
import { CnpjModule } from './modules/cnpj/cnpj.module';

@Module({
  imports: [CnpjModule],
})
export class AppModule {}
