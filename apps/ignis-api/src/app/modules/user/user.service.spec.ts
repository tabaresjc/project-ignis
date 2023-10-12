import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let mockRepository: Repository<User>;

  const users: User[] = [
    {id: 1, name: 'user 1'}
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    mockRepository = module.get<Repository<User>>(getRepositoryToken(User));
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#findAll()', () => {
    it('should return data from the repository.', async () => {
      const findSpy = jest.spyOn(mockRepository, 'find');

      findSpy.mockImplementation(async () => [...users]);

      const results = await service.findAll();

      expect(results).toEqual(users);
      expect(findSpy).toHaveBeenCalled();
    });
  });
});
