/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import config from './app/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function setupSwagger(app:INestApplication) {
  Logger.log(`adding SwaggerModule`);
  const options = new DocumentBuilder()
    .setTitle('Ignis API')
    .setDescription(`The Ignis API is designed to transform, store and stream audio.`)
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
}

(async () => {
  try {
    const app = await NestFactory.create(AppModule);
    setupSwagger(app);
    await app.listen(config.port);
    Logger.log(`🚀 ignis-api is running on: http://localhost:${config.port}`);
  } catch (err) {
    Logger.error('Unrecoverable error - process aborted.', err);
    process.exit(1);
  }
})();
