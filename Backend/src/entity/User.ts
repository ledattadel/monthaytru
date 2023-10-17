import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
	JoinColumn,
} from 'typeorm';
import { Account, Cart, ImageUpload } from './index';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  idCardNumber: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string | null;

  @Column({ type: 'timestamp', nullable: true })
  dob: Date | null;

	@OneToOne(() => ImageUpload, (imageUpload) => imageUpload.user, {nullable: true})
	@JoinColumn()
  avatar: ImageUpload | null;

  @Column({ nullable: true })
  email: string | null;

  @Column({ nullable: true })
  phoneNumber: string | null;

  @Column('timestamp', { name: 'delete_at', nullable: true })
  deleteAt: Date | null;

  @OneToOne(() => Account, (account) => account.user)
  account: Account;

  @OneToMany(() => Cart, (cart) => cart.customer)
  carts: Cart[];

	@OneToMany(() => Cart, (cart) => cart.approvalEmployee)
  cartsApproved: Cart[];
}
