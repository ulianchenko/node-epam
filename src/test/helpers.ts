/* eslint-disable import/no-extraneous-dependencies */
import Joi from 'joi';
import { USERS_API_URL } from './constants';
import { User } from '../types/user';

export const validateUser = (user: User) => ({
  user: {
    id: expect.any(String),
    name: user.name,
    email: user.email,
  },
  links: {
    self: `${USERS_API_URL}/${user.id}`,
    hobbies: `${USERS_API_URL}/${user.id}/hobbies`,
  },
});

export const validateHobbies = (userId: string, hobbies: string[]) => ({
  hobbies,
  links: {
    self: `${USERS_API_URL}/${userId}/hobbies`,
    user: `${USERS_API_URL}/${userId}`,
  },
});

export const userSchema = Joi.object({
  links: Joi.object({
    hobbies: Joi.string().regex(/^\/api\/users\/.+\/hobbies$/).required(),
    self: Joi.string().regex(/^\/api\/users\/.+$/).required(),
  }).required(),
  user: Joi.object({
    email: Joi.string().required(),
    id: Joi.string().uuid().required(),
    name: Joi.string().required(),
  }).required(),
});

export const getUsersResponseSchema = Joi.object({
  data: Joi.array().items(userSchema),
  error: Joi.allow(null),
});
