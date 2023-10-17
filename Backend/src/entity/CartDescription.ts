import {
  Entity,
  PrimaryColumn,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cart, CartType, Product } from './index';

@Entity()
export class CartDescription {
  @PrimaryGeneratedColumn()
  cartDesId: number;

  @ManyToOne(() => Cart, (cart) => cart.cartDescriptions, {
    onDelete: 'CASCADE',
  })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartDescriptions)
  product: Product;

  @Column({ default: () => '0' })
  quantity: number;

  @Column({ default: () => '0' })
  price: number;

	@Column({nullable: true})
  type: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  usageTime: string | null;

  @Column('timestamp', { name: 'delete_at', nullable: true })
  deleteAt: string | null;

  //@ManyToOne(() => CartType, (cartType) => cartType.cartDescriptions)
  //cartType: CartType;
}
