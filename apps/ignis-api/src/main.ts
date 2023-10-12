/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import config from './app/config';

(async () => {
  try {
    const app = await NestFactory.create(AppModule);
    await app.listen(config.port);
    Logger.log(`🚀 ignis-api is running on: http://localhost:${config.port}`);
  } catch (err) {
    Logger.error('Unrecoverable error - process aborted.', err);
    process.exit(1);
  }
})();
