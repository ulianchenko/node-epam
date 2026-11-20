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

export const getProductsController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await getAllProducts();
    res.status(200).json({ data });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProductByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await getProductById(req.params.id);
    res.status(200).json({ data });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProductController = async (req: Request, res: Response): Promise<void> => {
  const parsed = productBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid request body' });
    return;
  }

  try {
    const data = await createProduct(parsed.data);
    res.status(201).json({ data });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProductController = async (req: Request, res: Response): Promise<void> => {
  const parsed = productBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid request body' });
    return;
  }

  try {
    const data = await updateProduct(req.params.id, parsed.data);
    res.status(200).json({ data });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProductController = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await deleteProduct(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
