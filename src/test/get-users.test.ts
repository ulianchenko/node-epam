/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import { USERS_API_HOST, USERS_API_URL } from './constants';
import { getUsersResponseSchema } from './helpers';

describe('GET /api/users', () => {
  test('should return list of users created', async () => {
    const { body } = await request(USERS_API_HOST)
      .get(USERS_API_URL)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect('Cache-Control', /public,\s*max-age=3600|max-age=3600,\s*public/)
      .expect(200);

    const { error } = getUsersResponseSchema.validate(body);
    expect(error).toBeUndefined();
  });
});
