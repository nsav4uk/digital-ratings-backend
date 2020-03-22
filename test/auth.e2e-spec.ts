import { Test, TestingModule } from '@nestjs/testing';
import { CanActivate, ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;

  const mockLocalGuard: CanActivate = {
    canActivate(context: ExecutionContext) {
      const req = context.switchToHttp().getRequest();
      req.user = { id: 1, username: 'tester' };
      return true;
    },
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).overrideGuard(AuthGuard('local')).useValue(mockLocalGuard).compile();

    app = moduleFixture.createNestApplication();
    authService = moduleFixture.get<AuthService>(AuthService);
    await app.init();
  });

  it('/auth/login (POST)', () => {
    const result = {
      access_token: 'token',
    };

    jest.spyOn(authService, 'login').mockReturnValue(result);

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'tester', password: 'qwerty' })
      .expect(201)
      .expect(result);
  });

  afterEach(async () => {
    await app.close();
  });
});
