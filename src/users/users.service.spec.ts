import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return findOne', async () => {
    const user: User = {
      id: 1,
      username: 'tester',
      email: 'tester@test.com',
      password: 'qwerty',
      isActive: true,
    };

    jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(user);
    expect(await service.findOne('tester')).toEqual(user);
  });

  it('should not return findOne', async () => {
    jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(undefined);
    expect(await service.findOne('tester')).toEqual(undefined);
  });
});
