import { MikroORM, EntityManager, defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { Product } from '../entities/product.entity';

export const DB_USER = 'postgres'; // local: 'node_gmp'
export const DB_PASSWORD = 'postgres'; // local: 'password123'
export const DB_NAME = 'postgres'; // local: 'node_gmp'
export const DB_HOST = 'localhost';
export const DB_PORT = 5432;

let ormInstance: MikroORM | null = null;

export const ormConfig = defineConfig({
  entities: [Product],
  dbName: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  extensions: [Migrator],
  migrations: {
    path: './dist/src/migrations',
    pathTs: './src/migrations',
  },
  allowGlobalContext: true,
});

export default ormConfig;

export const initOrm = async (): Promise<MikroORM> => {
  if (!ormInstance) {
    ormInstance = await MikroORM.init(ormConfig);
  }
  return ormInstance;
};

export const getEm = async (): Promise<EntityManager> => {
  const orm = await initOrm();
  return orm.em.fork();
};

export const closeOrm = async (): Promise<void> => {
  if (ormInstance) {
    await ormInstance.close(true);
    ormInstance = null;
  }
};
