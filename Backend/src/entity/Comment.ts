import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Account, Product } from './index';

@Entity()
export class Comment {
	@PrimaryGeneratedColumn()
	commentId: number;

  @Column()
  accountId: number;

  @ManyToOne(() => Account, (account) => account.comments)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column()
  productId: number;

  @ManyToOne(() => Product, (product) => product.comments)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  time: string | null;
}
