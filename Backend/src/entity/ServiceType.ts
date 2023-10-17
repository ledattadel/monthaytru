import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './index';

@Entity()
export class ServiceType {
  @PrimaryGeneratedColumn()
  id: number;

	@Column()
  name: string;

	@OneToMany(() => Product, (product) => product.productType)
  products: Product[];
}
