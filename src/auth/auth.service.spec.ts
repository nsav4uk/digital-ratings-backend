import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { JWT_MODULE_OPTIONS } from '@nestjs/jwt/dist/jwt.constants';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useClass: JwtService,
        },
        {
          provide: JWT_MODULE_OPTIONS,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validateUser', async () => {
    const user: User = {
      id: 1,
      username: 'tester',
      email: 'tester@test.com',
      password: 'qwerty',
      isActive: true,
    };

    const {password, ...result} = user;

    jest.spyOn(usersService, 'findOne').mockResolvedValueOnce(user);
    expect(await service.validateUser('tester', 'qwerty')).toEqual(result);
  });

  it('should not validateUser', async () => {
    jest.spyOn(usersService, 'findOne').mockResolvedValueOnce(undefined);
    expect(await service.validateUser('tester', 'qwerty')).toEqual(null);
  });

  it('should login', async () => {
    const user: User = {
      id: 1,
      username: 'tester',
      email: 'tester@test.com',
      password: 'qwerty',
      isActive: true,
    };

    const token = 'token';
    const result = {
      access_token: token,
    };

    jest.spyOn(jwtService, 'sign').mockReturnValue(token);
    expect(await service.login(user)).toEqual(result);
  });
});
