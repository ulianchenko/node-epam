/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import { PUBLIC_HOLIDAYS_API_URL } from '../config';

describe('Public Holidays E2E Tests', () => {
  const currentYear = new Date().getFullYear();

  it('GET /PublicHolidays/{year}/{country} should return 200 and a list of holidays', async () => {
    const response = await request(PUBLIC_HOLIDAYS_API_URL).get(
      `/PublicHolidays/${currentYear}/NL`,
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('date');
    expect(response.body[0]).toHaveProperty('name');
  });

  it('GET /NextPublicHolidays/{country} should return 200 and upcoming holidays', async () => {
    const response = await request(PUBLIC_HOLIDAYS_API_URL).get(
      '/NextPublicHolidays/FR',
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('date');
  });
});
