import { ProductEntity } from '../entities/product.entity';
import { ProductModel, toProductEntity } from '../models/product.model';

export const findAllProducts = async (): Promise<ProductEntity[]> => {
  const docs = await ProductModel.find().lean<ProductEntity[]>();
  return docs.map((doc) => toProductEntity(doc));
};

export const findProductById = async (id: string): Promise<ProductEntity | null> => {
  const doc = await ProductModel.findOne({ id }).lean<ProductEntity | null>();
  return doc ? toProductEntity(doc) : null;
};

export const createProductRecord = async (product: ProductEntity): Promise<ProductEntity> => {
  const created = await ProductModel.create(product);
  return toProductEntity(created.toObject());
};

export const updateProductRecord = async (
  id: string,
  updates: Omit<ProductEntity, 'id'>,
): Promise<ProductEntity | null> => {
  const updated = await ProductModel.findOneAndUpdate(
    { id },
    { $set: updates },
    { new: true, lean: true },
  ).exec();

  return updated ? toProductEntity(updated as ProductEntity) : null;
};

export const deleteProductRecord = async (id: string): Promise<boolean> => {
  const result = await ProductModel.deleteOne({ id }).exec();
  return (result.deletedCount ?? 0) > 0;
};
