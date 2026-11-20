import mongoose from 'mongoose';
import { DB_CONNECTION_STRING, DB_USER, DB_PASSWORD } from '../../env/mongodb-connection';

const COLLECTION_NAME: string = 'products';

describe('Database connection', () => {
  beforeAll(async () => {
    await mongoose.connect(DB_CONNECTION_STRING, (!DB_CONNECTION_STRING.includes('admin') ? { user: DB_USER, pass: DB_PASSWORD, authSource: 'admin' } : {}));
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('Check if products exist in the collection', async () => {
    if (!mongoose.connection.db) {
      throw new Error('Failed to find a connection for database');
    }

    const products = await mongoose.connection.db.collection(COLLECTION_NAME).find().toArray();
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });
});
