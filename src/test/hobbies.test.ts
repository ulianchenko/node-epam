/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import { USERS_API_HOST, USERS_API_URL } from './constants';
import { validateHobbies } from './helpers';
import { users } from '../data/users';

describe('/api/users/{userId}/hobbies', () => {
  describe('E2E (get hobbies + update hobbies)', () => {
    const userNoHobbies = users[2];
    const hobbiesToAdd1 = ['reading'];
    const hobbiesToAdd2 = ['traveling'];
    const hobbiesToAdd3 = ['reading', 'programming']; // reading is duplicate

    test('should return empty list of hobbies if none are added yet', async () => {
      const { body } = await request(USERS_API_HOST)
        .get(`${USERS_API_URL}/${userNoHobbies.id}/hobbies`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect('Cache-Control', /private,\s*max-age=3600|max-age=3600,\s*private/)
        .expect(200);

      expect(body).toEqual({ data: validateHobbies(userNoHobbies.id, []), error: null });
    });

    test('should update user hobbies - add new if there are none', async () => {
      await request(USERS_API_HOST)
        .patch(`${USERS_API_URL}/${userNoHobbies.id}/hobbies`)
        .send({ hobbies: hobbiesToAdd1 })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      const { body } = await request(USERS_API_HOST)
        .get(`${USERS_API_URL}/${userNoHobbies.id}/hobbies`);

      expect(body).toEqual({ data: validateHobbies(userNoHobbies.id, hobbiesToAdd1), error: null });
    });

    test('should update user hobbies - add new to existing hobbies', async () => {
      await request(USERS_API_HOST)
        .patch(`${USERS_API_URL}/${userNoHobbies.id}/hobbies`)
        .send({ hobbies: hobbiesToAdd2 })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      const { body } = await request(USERS_API_HOST)
        .get(`${USERS_API_URL}/${userNoHobbies.id}/hobbies`);

      expect(body).toEqual({
        data: validateHobbies(
          userNoHobbies.id,
          [...hobbiesToAdd1, ...hobbiesToAdd2],
        ),
        error: null,
      });
    });

    test('should update user hobbies - add new to existing hobbies, duplicates are removed', async () => {
      await request(USERS_API_HOST)
        .patch(`${USERS_API_URL}/${userNoHobbies.id}/hobbies`)
        .send({ hobbies: hobbiesToAdd3 })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      const { body } = await request(USERS_API_HOST)
        .get(`${USERS_API_URL}/${userNoHobbies.id}/hobbies`);

      expect(body).toEqual({
        data: validateHobbies(
          userNoHobbies.id,
          ['reading', 'traveling', 'programming'],
        ),
        error: null,
      });
    });

    test('should return list of hobbies added for user', async () => {
      const { body } = await request(USERS_API_HOST)
        .get(`${USERS_API_URL}/${userNoHobbies.id}/hobbies`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect('Cache-Control', /private,\s*max-age=3600|max-age=3600,\s*private/)
        .expect(200);

      expect(body).toEqual(
        { data: validateHobbies(userNoHobbies.id, ['reading', 'traveling', 'programming']), error: null },
      );
    });
  });

  describe('Update hobbies', () => {
    test('should return error if user doesn\'t exist', async () => {
      const randomUserId = 'a07bfb92-1458-4f0d-a385-b866e30f6ca0';

      const { body } = await request(USERS_API_HOST)
        .patch(`${USERS_API_URL}/${randomUserId}/hobbies`)
        .send({ hobbies: [] })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(body).toEqual({
        data: null,
        error: `User with id ${randomUserId} doesn't exist`,
      });
    });
  });

  describe('Get hobbies', () => {
    test('should return error if user doesn\'t exist', async () => {
      const randomUserId = 'a07bfb92-1458-4f0d-a385-b866e30f6ca0';

      const { body, headers } = await request(USERS_API_HOST)
        .get(`${USERS_API_URL}/${randomUserId}/hobbies`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(body).toEqual({
        data: null,
        error: `User with id ${randomUserId} doesn't exist`,
      });
      expect(headers).not.toHaveProperty('Cache-Control');
    });
  });
});
