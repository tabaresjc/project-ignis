/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { PhraseService } from './phrase.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Phrase } from './entities/phrase.entity';
import { transformAudioAndSaveToFile } from './modules/audio';
import { deleteFile } from './modules/utils/deleteFile';
import { User } from '../user/entities/user.entity';

jest.mock('./modules/audio');
jest.mock('./modules/utils/deleteFile');

describe('PhraseService', () => {
  let service: PhraseService;
  let mockRepository: Repository<Phrase>;
  
  const wrongFile = {
    filename: 'sample-3s.m4a',
    path: './test/data/sample-3s.m4a',    
  } as Express.Multer.File;
  const file = {
    filename: 'sample-3s.mp3',
    path: './test/data/sample-3s.mp3',
  } as Express.Multer.File;
  const phrase: Phrase = {
    id: 1,
    userID: 1,
    format: 'm4a',
    filePath: 'filePath.wav',
    user: new User(),
  };

  const transformAudioAndSaveToFileMock = transformAudioAndSaveToFile as jest.MockedFunction<any>;
  const deleteFileMock = deleteFile as jest.MockedFunction<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhraseService,
        {
          provide: getRepositoryToken(Phrase),
          useClass: Repository,
        },
      ],
    }).compile();

    mockRepository = module.get<Repository<Phrase>>(getRepositoryToken(Phrase));
    service = module.get<PhraseService>(PhraseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#transformAndUpdateAudioPhrase()', () => {
    it('should reject any file that is not in the allow list.', async () => {
      const findOneBySpy = jest.spyOn(mockRepository, 'findOneBy');
      let error;
      try {
        await service.transformAndUpdateAudioPhrase(1, 1, wrongFile as Express.Multer.File);
      } catch (e) {
        error = e;
      }
      expect(error).not.toBeNull();
      expect(error.message).not.toBeUndefined();
      expect(error.name).toEqual('BadRequestException')
      expect(findOneBySpy).not.toBeCalled();
    });

    it('should reject when the provided user/phrase convo is not found.', async () => {
      const findOneBySpy = jest.spyOn(mockRepository, 'findOneBy');
      findOneBySpy.mockResolvedValue(null);

      let error;
      try {
        await service.transformAndUpdateAudioPhrase(1, 1, file);
      } catch (e) {
        error = e;
      }
      expect(error).not.toBeNull();
      expect(error.message).not.toBeUndefined();
      expect(error.name).toEqual('NotFoundException')
      expect(findOneBySpy).toBeCalled();
    });
    
    it('should succesfully store the record in db.', async () => {
      const findOneBySpy = jest.spyOn(mockRepository, 'findOneBy');
      const saveSpy = jest.spyOn(mockRepository, 'save');
      
      findOneBySpy.mockResolvedValue(phrase);
      transformAudioAndSaveToFileMock.mockResolvedValue(null);
      deleteFileMock.mockResolvedValue(null);
      saveSpy.mockImplementation((newPhrase) => newPhrase as any);

      const result = await service.transformAndUpdateAudioPhrase(1, 1, file);
      
      expect(findOneBySpy).toBeCalled();
      expect(saveSpy).toBeCalled();
      expect(result.format).toEqual('mp3');
      expect(result.filePath).toContain('.wav');
    });     
  });
});
