import { z } from 'zod';

export const productBodySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().finite().nonnegative(),
});

export type ProductInput = z.infer<typeof productBodySchema>;
