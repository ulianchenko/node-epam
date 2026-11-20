import Joi from 'joi';

export const createUserResponseSchema = Joi.object({
  data: Joi.object({
    id: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('admin', 'user').required(),
  }),
  error: Joi.allow(null),
});

export const loginUserResponseSchema = Joi.object({
  data: Joi.object({
    token: Joi.string().required(),
  }),
  error: Joi.allow(null),
});

export const registerUserSchema = Joi.object({
  data: Joi.object({
    id: Joi.string().required(),
    email: Joi.string().required(),
    role: Joi.string().valid('admin', 'user').required(),
  }),
  error: Joi.allow(null),
});

export const loginUserSchema = Joi.object({
  data: Joi.object({
    token: Joi.string().required(),
  }),
  error: Joi.allow(null),
});

export const errorResponseSchema = Joi.object({
  error: Joi.string().required(),
});

export const productSchema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
});

export const productsResponseSchema = Joi.object({
  data: Joi.array().items(productSchema),
});

export const productResponseSchema = Joi.object({
  data: productSchema,
});
