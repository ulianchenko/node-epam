/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import { USERS_API_HOST, USERS_API_URL } from './constants';
import { users } from '../data/users';

describe('DELETE /api/users', () => {
  test('should delete user', async () => {
    const { body } = await request(USERS_API_HOST)
      .delete(`${USERS_API_URL}/${users[0].id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(body).toEqual({
      data: { success: true },
      error: null,
    });
  });

  test('should return error if user doesn\'t exist', async () => {
    const randomUserId = 'a07bfb92-1458-4f0d-a385-b866e30f6ca0';

    const { body } = await request(USERS_API_HOST)
      .delete(`${USERS_API_URL}/${randomUserId}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(body).toEqual({
      data: null,
      error: `User with id ${randomUserId} doesn't exist`,
    });
  });
});
