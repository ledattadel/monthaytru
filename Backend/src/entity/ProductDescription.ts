import { Entity, JoinColumn, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
//import { Product, DescriptionType } from './index';
import { Product } from './index';

@Entity()
export class ProductDescription {
	@PrimaryGeneratedColumn()
	productDesId: number

  @Column()
  productId: number;

  @ManyToOne(() => Product, (product) => product.productDescriptions)
  @JoinColumn({ name: 'productId' })
  product: Product;

  //@Column()
  //descriptionTypeId: number;

  //@ManyToOne(() => DescriptionType, (descriptionType) => descriptionType.productDescriptions)
  //@JoinColumn({ name: 'descriptionTypeId' })
  //descriptionType: DescriptionType;

  @Column()
  content: string;
}
