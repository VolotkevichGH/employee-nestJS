import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`api/v1/`)
  await app.listen(3000);
}
bootstrap().then(r => {
  console.log(`Server running on port ${process.env.PORT}...`);
});
