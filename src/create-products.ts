import { products } from './data/products';
import { connect, disconnect } from './env/mongodb-connection';
import { ProductModel } from './models/product.model';

const seedProducts = async (): Promise<void> => {
  await connect();

  try {
    await Promise.all(
      products.map((product) => ProductModel.updateOne(
        { id: product.id },
        { $set: product },
        { upsert: true },
      ).exec()),
    );
    console.log('Products seeded successfully');
  } finally {
    await disconnect();
  }
};

seedProducts().catch((err) => {
  console.error('Failed to seed products:', err);
  process.exit(1);
});
