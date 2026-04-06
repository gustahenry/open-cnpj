import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as util from 'util';

// Desabilitar pretty printing de objetos grandes
if (process.env.NODE_ENV !== 'development') {
  util.inspect.defaultOptions.colors = false;
  util.inspect.defaultOptions.depth = 0;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
