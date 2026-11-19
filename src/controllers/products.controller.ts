import { Request, Response } from 'express';
import { productBodySchema } from '../schemas/product.schema';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  NotFoundError,
  updateProduct,
} from '../services/products.service';

export const getProductsController = (_req: Request, res: Response): void => {
  const data = getAllProducts();
  res.status(200).json({ data });
};

export const getProductByIdController = (req: Request, res: Response): void => {
  try {
    const data = getProductById(req.params.id);
    res.status(200).json({ data });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProductController = (req: Request, res: Response): void => {
  const parsed = productBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid request body' });
    return;
  }

  const data = createProduct(parsed.data);
  res.status(201).json({ data });
};

export const updateProductController = (req: Request, res: Response): void => {
  const parsed = productBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid request body' });
    return;
  }

  try {
    const data = updateProduct(req.params.id, parsed.data);
    res.status(200).json({ data });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProductController = (req: Request, res: Response): void => {
  try {
    const result = deleteProduct(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
