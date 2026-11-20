import mongoose, { Schema, Model } from 'mongoose';
import { ProductEntity } from '../entities/product.entity';

const productSchema = new Schema<ProductEntity>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
  },
  {
    collection: 'products',
    versionKey: false,
  },
);

const toProductEntity = (doc: ProductEntity & { _id?: unknown }): ProductEntity => ({
  id: doc.id,
  title: doc.title,
  description: doc.description,
  price: doc.price,
});

productSchema.set('toJSON', {
  transform: (_doc, ret) => toProductEntity(ret as ProductEntity & { _id?: unknown }),
});

productSchema.set('toObject', {
  transform: (_doc, ret) => toProductEntity(ret as ProductEntity & { _id?: unknown }),
});

export const ProductModel: Model<ProductEntity> = mongoose.models.Product || mongoose.model<ProductEntity>('Product', productSchema);

export { toProductEntity };
