import { products } from '../data/products';
import { ProductEntity } from '../entities/product.entity';

let PRODUCTS: ProductEntity[] = [...products];

export const findAllProducts = (): ProductEntity[] => [...PRODUCTS];

export const findProductById = (
  id: string,
): ProductEntity | undefined => PRODUCTS.find((item) => item.id === id);

export const createProductRecord = (product: ProductEntity): ProductEntity => {
  PRODUCTS.push({ ...product });
  return product;
};

export const updateProductRecord = (
  id: string,
  updates: Omit<ProductEntity, 'id'>,
): ProductEntity | undefined => {
  const index = PRODUCTS.findIndex((item) => item.id === id);
  if (index === -1) {
    return undefined;
  }

  const updated: ProductEntity = {
    id,
    ...updates,
  };
  PRODUCTS[index] = updated;
  return updated;
};

export const deleteProductRecord = (id: string): boolean => {
  const initialLength = PRODUCTS.length;
  PRODUCTS = PRODUCTS.filter((item) => item.id !== id);
  return PRODUCTS.length < initialLength;
};
