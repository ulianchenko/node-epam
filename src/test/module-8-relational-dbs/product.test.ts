/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';

import { productResponseSchema, errorResponseSchema, productsResponseSchema } from '../helpers/schemas';
import {
  API_HOST, PRODUCTS_API_URL, PRODUCT_ID, RANDOM_PRODUCT,
} from '../helpers/constants';

describe('Products /api/products', () => {
  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const newProduct = {
        title: 'Create Product',
        description: 'Create Description',
        price: 100,
      };

      const { body } = await request(API_HOST)
        .post(PRODUCTS_API_URL)
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
        .expect('Content-Type', /json/)
        .expect(200);

      await productsResponseSchema.validateAsync(body);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a product by ID', async () => {
      const { body } = await request(API_HOST)
        .get(`${PRODUCTS_API_URL}/${PRODUCT_ID}`)
        .expect('Content-Type', /json/)
        .expect(200);

      await productResponseSchema.validateAsync(body);
    });

    it("should return 404 if product doesn't exist", async () => {
      const { body } = await request(API_HOST)
        .get(`${PRODUCTS_API_URL}/${RANDOM_PRODUCT}`)
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
        .send(updatedProduct)
        .expect('Content-Type', /json/)
        .expect(404);

      await errorResponseSchema.validateAsync(body);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product', async () => {
      await request(API_HOST)
        .delete(`${PRODUCTS_API_URL}/${PRODUCT_ID}`)
        .expect('Content-Type', /json/)
        .expect(200);
    });

    it("should return 404 if product doesn't exist", async () => {
      const { body } = await request(API_HOST)
        .delete(`${PRODUCTS_API_URL}/${RANDOM_PRODUCT}`)
        .expect('Content-Type', /json/)
        .expect(404);

      await errorResponseSchema.validateAsync(body);
    });
  });
});
