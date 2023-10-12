import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import mime from 'mime';
import path from 'path';
import { Repository } from 'typeorm';
import config from '../../config';
import {
  ACCEPTED_FILE_TYPES,
  ACCEPTED_MIME_TYPES,
  AUDIO_FORMATS,
} from './constants';
import { CreatePhraseDto } from './dto/create-phrase.dto';
import { Phrase } from './entities/phrase.entity';
import { transformAudioAndSaveToFile } from './modules/audio';
import { deleteFile, generateUUID, getDataPathLocation } from './modules/utils';

@Injectable()
export class PhraseService {
  constructor(
    @InjectRepository(Phrase)
    private readonly phraseRepository: Repository<Phrase>
  ) {}

  create(createPhraseDto: CreatePhraseDto) {
    const phrase: Phrase = new Phrase();
    phrase.userID = createPhraseDto.userID;
    return this.phraseRepository.save(phrase);
  }

  findOne(id: number) {
    return this.phraseRepository.findOneBy({ id });
  }

  findByIdAndUserId(id: number, userID: number) {
    return this.phraseRepository.findOneBy({ id, userID });
  }

  remove(id: number) {
    return this.phraseRepository.delete(id);
  }

  async transformAndUpdateAudioPhrase(
    id: number,
    userID: number,
    file: Express.Multer.File
  ): Promise<Phrase> {
    // ensure correct mime type is provided
    const format = file.filename.split('.').pop();
    const mimeType = mime.getType(file.path);

    if (
      ACCEPTED_FILE_TYPES.indexOf(format) === -1 ||
      ACCEPTED_MIME_TYPES.indexOf(mimeType) === -1
    ) {
      throw new BadRequestException(
        `The format of the audio file is not supported: ${format} | ${mimeType}.`
      );
    }

    const phrase = await this.findByIdAndUserId(id, userID);

    if (!phrase) {
      throw new NotFoundException(
        'Ooops... the requested phrase does not exist.'
      );
    }

    const currentFilePath = phrase.filePath;
    const filePath = `${generateUUID()}.${AUDIO_FORMATS.WAV}`;

    await transformAudioAndSaveToFile(
      file.path,
      getDataPathLocation(filePath),
      {
        format: AUDIO_FORMATS.WAV,
      }
    );

    await deleteFile(file.path);

    const newPhrase = this.phraseRepository.save({
      ...phrase,
      format,
      filePath,
    });

    // remove the previous file
    if (currentFilePath) {
      await deleteFile(getDataPathLocation(currentFilePath));
    }

    return newPhrase;
  }

  async transformPhraseToFormat(
    id: number,
    userID: number,
    format: string
  ): Promise<string> {
    const phrase = await this.findByIdAndUserId(id, userID);

    if (!phrase) {
      throw new NotFoundException(
        'Ooops... the requested phrase does not exist.'
      );
    }

    if (ACCEPTED_FILE_TYPES.indexOf(format) === -1) {
      throw new BadRequestException(
        `The requested format is not supported: ${format}.`
      );
    }

    const filePath = path.join(config.dataPath, phrase.filePath);

    // TODO: implement a job to cleanup tmp files after X seconds
    const newFilePath = `tmp_transform_${generateUUID()}.${format}`;
    const outputFilePath = path.join(config.dataPath, newFilePath);

    await transformAudioAndSaveToFile(filePath, outputFilePath, {
      format,
    });

    return outputFilePath;
  }
}
