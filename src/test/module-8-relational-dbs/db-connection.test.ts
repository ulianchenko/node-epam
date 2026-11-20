import { Client } from 'pg';
import {
  DB_NAME, DB_HOST, DB_PORT, DB_PASSWORD, DB_USER,
} from '../../env/postgresql-connection';

const pgClient = new Client({
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
});

describe('Database connection', () => {
  beforeAll(async () => {
    await pgClient.connect();
  });

  afterAll(async () => {
    await pgClient.end();
  });

  test('Check if products exist in the table', async () => {
    const productsResponse = await pgClient.query('select * from products');

    expect(productsResponse.rows).toBeDefined();
    expect(Array.isArray(productsResponse.rows)).toBeTruthy();
    expect(productsResponse.rowCount).toBeGreaterThan(0);
  });
});
