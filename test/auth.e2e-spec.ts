import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    await app.init();
  });
let access_token:string
let refresh_token:string

  it('Should return an Unauthorized', () => {
    return request(app.getHttpServer())
      .get('/auth/user')
      .expect(401)
  });

  it('Should sign in the user', () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({email:"marufb",password:"Maruf3839!"})
      .expect(200)
      .expect((response)=>{
       const CookieHeader=response.header['set-cookie']
       access_token = /access_token=([^;]+)/.exec(CookieHeader)[1];
       refresh_token = /refresh_token=([^;]+)/.exec(CookieHeader)[1];
       expect(typeof access_token).toBe('string')
       expect(typeof refresh_token).toBe('string')
      })
  });

  it('Should return all user', () => {
    return request(app.getHttpServer())
      .get('/auth/user')
      .set('Cookie',[`access_token=${access_token}`,
      `refresh_token=${refresh_token}`])
      .expect(200)
  });
});
