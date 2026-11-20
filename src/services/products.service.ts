import { v4 as uuidv4 } from 'uuid';
import { ProductEntity } from '../entities/product.entity';
import { ProductInput } from '../schemas/product.schema';
import {
  createProductRecord,
  deleteProductRecord,
  findAllProducts,
  findProductById,
  updateProductRecord,
} from '../repositories/products.repository';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export const getAllProducts = async (): Promise<ProductEntity[]> => findAllProducts();

export const getProductById = async (id: string): Promise<ProductEntity> => {
  const product = await findProductById(id);
  if (!product) {
    throw new NotFoundError('Product not found');
  }
  return product;
};

export const createProduct = async (input: ProductInput): Promise<ProductEntity> => {
  const newProduct: ProductEntity = {
    id: uuidv4(),
    title: input.title,
    description: input.description,
    price: input.price,
  };
  return createProductRecord(newProduct);
};

export const updateProduct = async (id: string, input: ProductInput): Promise<ProductEntity> => {
  const updated = await updateProductRecord(id, {
    title: input.title,
    description: input.description,
    price: input.price,
  });

  if (!updated) {
    throw new NotFoundError('Product not found');
  }
  return updated;
};

export const deleteProduct = async (id: string): Promise<{ deleted: boolean }> => {
  const isDeleted = await deleteProductRecord(id);
  if (!isDeleted) {
    throw new NotFoundError('Product not found');
  }
  return { deleted: true };
};
