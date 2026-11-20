/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';

import {
  productResponseSchema,
  errorResponseSchema,
  productsResponseSchema,
  registerUserSchema,
  loginUserSchema,
} from '../helpers/schemas';
import {
  API_HOST,
  AUTH_API_URL,
  PRODUCTS_API_URL,
  PRODUCT_ID,
  RANDOM_TOKEN,
  RANDOM_PRODUCT,
} from '../helpers/constants';
import { UserRole } from '../../entities/user.entity';

let adminToken = '';
let userToken = '';

describe('Authentication API', () => {
  describe('Register', () => {
    it('should register a new admin user', async () => {
      const newAdmin = {
        email: 'admin-new@admin.admin',
        password: 'admin-new',
        role: UserRole.ADMIN,
      };

      const { body } = await request(API_HOST)
        .post(`${AUTH_API_URL}/register`)
        .send(newAdmin)
        .expect('Content-Type', /json/)
        .expect(201);

      await registerUserSchema.validateAsync(body);
    });

    it('should register a new user', async () => {
      const newUser = {
        email: 'alex@epam.com',
        password: 'alex',
        role: UserRole.USER,
      };

      const { body } = await request(API_HOST)
        .post(`${AUTH_API_URL}/register`)
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(201);

      await registerUserSchema.validateAsync(body);
    });

    it('should return 400 when email is not valid', async () => {
      const newUser = {
        email: 'invalid_email',
        password: 'password123',
        role: UserRole.USER,
      };

      const { body } = await request(API_HOST)
        .post(`${AUTH_API_URL}/register`)
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(400);

      await errorResponseSchema.validateAsync(body);
    });

    it('should return 400 when some keys are missing in request body', async () => {
      const newUser = {
        email: 'mike@epam.com', // password is missing
        role: UserRole.USER,
      };

      const { body } = await request(API_HOST)
        .post(`${AUTH_API_URL}/register`)
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(400);

      await errorResponseSchema.validateAsync(body);
    });

    it('should return 409 when user with such email already exists', async () => {
      const newUser = {
        email: 'bob@epam.com',
        password: 'bob',
        role: UserRole.USER,
      };

      const { body } = await request(API_HOST)
        .post(`${AUTH_API_URL}/register`)
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(409);

      await errorResponseSchema.validateAsync(body);
    });
  });

  describe('Login', () => {
    it('should log in admin user', async () => {
      const { body } = await request(API_HOST)
        .post(`${AUTH_API_URL}/login`)
        .send({
          email: 'admin@admin.admin',
          password: 'admin',
        })
        .expect('Content-Type', /json/)
        .expect(200);

      adminToken = body.data.token;

      await loginUserSchema.validateAsync(body);
    });

    it('should log in an existing user', async () => {
      const { body } = await request(API_HOST)
        .post(`${AUTH_API_URL}/login`)
        .send({
          email: 'bob@epam.com',
          password: 'bob',
        })
        .expect('Content-Type', /json/)
        .expect(200);

      userToken = body.data.token;

      await loginUserSchema.validateAsync(body);
    });

    it('should return 401 if there is no such user', async () => {
      const { body } = await request(API_HOST)
        .post(`${AUTH_API_URL}/login`)
        .send({
          email: 'ann@epam.com',
          password: 'ann',
        })
        .expect('Content-Type', /json/)
        .expect(401);

      await errorResponseSchema.validateAsync(body);
    });

    it('should return 401 if passwords do not match', async () => {
      const { body } = await request(API_HOST)
        .post(`${AUTH_API_URL}/login`)
        .send({
          email: 'bob@epam.com',
          password: 'bob-incorrect-password',
        })
        .expect('Content-Type', /json/)
        .expect(401);

      await errorResponseSchema.validateAsync(body);
    });
  });
});

describe('Products /api/products with auth', () => {
  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const newProduct = {
        title: 'Create Product',
        description: 'Create Description',
        price: 100,
      };

      const { body } = await request(API_HOST)
        .post(PRODUCTS_API_URL)
        .set('Authorization', `Bearer ${userToken}`)
        .send(newProduct)
        .expect('Content-Type', /json/)
        .expect(201);

      await productResponseSchema.validateAsync(body);
    });
  });

  describe('GET /api/products', () => {
    it('should retrieve all products', async () => {
      const { body } = await request(API_HOST)
        .get(PRODUCTS_API_URL)
        .set('Authorization', `Bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      await productsResponseSchema.validateAsync(body);
    });

    it('should return 401 if token is not provided', async () => {
      const { body } = await request(API_HOST)
        .get(PRODUCTS_API_URL)
        .expect('Content-Type', /json/)
        .expect(401);

      await errorResponseSchema.validateAsync(body);
    });

    it('should return 403 if invalid token is provided', async () => {
      const { body } = await request(API_HOST)
        .get(PRODUCTS_API_URL)
        .set('Authorization', 'Bearer invalid-token')
        .expect('Content-Type', /json/)
        .expect(403);

      await errorResponseSchema.validateAsync(body);
    });

    it("should return 404 if user doesn't exist", async () => {
      const { body } = await request(API_HOST)
        .get(PRODUCTS_API_URL)
        .set('Authorization', `Bearer ${RANDOM_TOKEN}`)
        .expect('Content-Type', /json/)
        .expect(404);

      await errorResponseSchema.validateAsync(body);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a product by ID', async () => {
      const { body } = await request(API_HOST)
        .get(`${PRODUCTS_API_URL}/${PRODUCT_ID}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      await productResponseSchema.validateAsync(body);
    });

    it("should return 404 if product doesn't exist", async () => {
      const { body } = await request(API_HOST)
        .get(`${PRODUCTS_API_URL}/${RANDOM_PRODUCT}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(404);

      await errorResponseSchema.validateAsync(body);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update an existing product', async () => {
      const updatedProduct = {
        title: 'Updated Product',
        description: 'Updated Description',
        price: 150,
      };

      const { body } = await request(API_HOST)
        .put(`${PRODUCTS_API_URL}/${PRODUCT_ID}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedProduct)
        .expect('Content-Type', /json/)
        .expect(200);

      await productResponseSchema.validateAsync(body);
    });

    it("should return 404 if product doesn't exist", async () => {
      const updatedProduct = {
        title: 'Updated Product',
        description: 'Updated Description',
        price: 150,
      };

      const { body } = await request(API_HOST)
        .put(`${PRODUCTS_API_URL}/${RANDOM_PRODUCT}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedProduct)
        .expect('Content-Type', /json/)
        .expect(404);

      await errorResponseSchema.validateAsync(body);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product as admin', async () => {
      await request(API_HOST)
        .delete(`${PRODUCTS_API_URL}/${PRODUCT_ID}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(200);
    });

    it('should return 403 if user is not admin', async () => {
      const { body } = await request(API_HOST)
        .delete(`${PRODUCTS_API_URL}/${PRODUCT_ID}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(403);

      await errorResponseSchema.validateAsync(body);
    });

    it("should return 404 if product doesn't exist", async () => {
      const { body } = await request(API_HOST)
        .delete(`${PRODUCTS_API_URL}/${RANDOM_PRODUCT}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(404);

      await errorResponseSchema.validateAsync(body);
    });
  });
});
