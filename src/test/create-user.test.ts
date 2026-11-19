/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import { USERS_API_HOST, USERS_API_URL } from './constants';
import { validateUser } from './helpers';
import { UserPartial } from '../types/user';

describe('POST /api/users', () => {
  test('should create new user', async () => {
    const user: UserPartial = { name: 'mary', email: 'mary@mary.mary' };

    const { body } = await request(USERS_API_HOST)
      .post(USERS_API_URL)
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);

    expect(body).toEqual({ data: validateUser(body.data.user), error: null });
  });
});
