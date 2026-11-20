import { Product, ProductEntity } from '../entities/product.entity';
import { getEm } from '../env/postgresql-connection';

const toProductEntity = (product: Product): ProductEntity => ({
  id: product.id,
  title: product.title,
  description: product.description,
  price: product.price,
});

export const findAllProducts = async (): Promise<ProductEntity[]> => {
  const em = await getEm();
  const rows = await em.find(Product, {});
  return rows.map(toProductEntity);
};

export const findProductById = async (id: string): Promise<ProductEntity | null> => {
  const em = await getEm();
  const row = await em.findOne(Product, { id });
  return row ? toProductEntity(row) : null;
};

export const createProductRecord = async (product: ProductEntity): Promise<ProductEntity> => {
  const em = await getEm();
  const created = em.create(Product, product);
  await em.persistAndFlush(created);
  return toProductEntity(created);
};

export const updateProductRecord = async (
  id: string,
  updates: Omit<ProductEntity, 'id'>,
): Promise<ProductEntity | null> => {
  const em = await getEm();
  const existing = await em.findOne(Product, { id });
  if (!existing) {
    return null;
  }

  em.assign(existing, updates);
  await em.flush();
  return toProductEntity(existing);
};

export const deleteProductRecord = async (id: string): Promise<boolean> => {
  const em = await getEm();
  const existing = await em.findOne(Product, { id });
  if (!existing) {
    return false;
  }

  await em.removeAndFlush(existing);
  return true;
};
