import { Entity, Column, JoinColumn, PrimaryColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product, Sale } from './index';


@Entity()
export class SaleDescription {
	@PrimaryColumn()
	productId: number;

	@ManyToOne(() => Product, (product) => product.saleDescriptions)
	@JoinColumn({name: 'productId'})
	product: Product;

	@PrimaryColumn()
	saleId: number;

	@ManyToOne(() => Sale, (sale) => sale.saleDescriptions)
	@JoinColumn({name: 'saleId'})
	sale: Sale;

	@Column()
	salePercent: number;
}
