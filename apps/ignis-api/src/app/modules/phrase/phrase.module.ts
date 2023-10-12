import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { Phrase } from './entities/phrase.entity';
import { PhraseController } from './phrase.controller';
import { PhraseService } from './phrase.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Phrase]),
    UserModule,
  ],
  controllers: [PhraseController],
  providers: [PhraseService]
})
export class PhraseModule {}
