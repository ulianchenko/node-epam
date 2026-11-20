import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

export interface ProductEntity {
  id: string;
  title: string;
  description: string;
  price: number;
}

@Entity({ tableName: 'products' })
export class Product implements ProductEntity {
  @PrimaryKey({ type: 'uuid' })
    id!: string;

  @Property({ type: 'string' })
    title!: string;

  @Property({ type: 'string' })
    description!: string;

  @Property({ type: 'integer' })
    price!: number;
}
