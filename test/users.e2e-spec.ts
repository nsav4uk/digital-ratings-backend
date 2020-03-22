import { Test, TestingModule } from '@nestjs/testing';
import { CanActivate, ExecutionContext, INestApplication, UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';
import { AuthGuard } from '@nestjs/passport';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  const token = 'token';
  const user = { id: 1, username: 'tester' };

  const mockJwtGuard: CanActivate = {
    canActivate(context: ExecutionContext) {
      const req = context.switchToHttp().getRequest();
      if (req.headers.authorization && req.headers.authorization === `Bearer ${ token }`) {
        req.user = user;
        return true;
      }
      throw new UnauthorizedException();
    },
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).overrideGuard(AuthGuard('jwt')).useValue(mockJwtGuard).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/user/profile (GET)', () => {
    return request(app.getHttpServer())
      .get('/user/profile')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect(user);
  });

  it('/user/profile (GET)', () => {
    return request(app.getHttpServer())
      .get('/user/profile')
      .auth('fail_token', { type: 'bearer' })
      .expect(401)
      .expect({ statusCode: 401, error: 'Unauthorized' });
  });

  afterEach(async () => {
    await app.close();
  });
});
