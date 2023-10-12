import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './config';
import { User } from './modules/user/entities/user.entity';
import { UserModule } from './modules/user/user.module';
import { PhraseModule } from './modules/phrase/phrase.module';
import { Phrase } from './modules/phrase/entities/phrase.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...config.database,
      entities: [User, Phrase],
    }),
    UserModule,
    PhraseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
