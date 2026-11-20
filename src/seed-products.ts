import { products } from './data/products';
import { Product } from './entities/product.entity';
import { closeOrm, getEm } from './env/postgresql-connection';

export const seedProducts = async (): Promise<void> => {
  const em = await getEm();

  try {
    await Promise.all(
      products.map((item) => em.upsert(Product, {
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
      })),
    );
    await em.flush();
    console.log('Products seeded successfully');
  } finally {
    await closeOrm();
  }
};

if (require.main === module) {
  seedProducts().catch((err) => {
    console.error('Failed to seed products:', err);
    process.exit(1);
  });
}
