import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User, Status, CartDescription } from './index';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: String;
  

  @Column({nullable: true})
  carNumber: string | null;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: String;
  

  @Column({name: "totalprice", default: () => '0' })
  totalPrice: number;

  @Column({ type: 'timestamp', nullable: true })
  timeToDone: string | null;

	@Column({ type: 'timestamp', nullable: true })
  returnDate: string | null;

  @Column({nullable: true})
  employeeName: string | null;

  @Column({nullable: true})
  description: string | null;

  // many to one
  @ManyToOne(() => Status, (status) => status.carts)
  status: Status;

  // many to one
  @ManyToOne(() => User, (user) => user.carts)
  customer: User;

  @Column('timestamp', { name: 'delete_at', nullable: true })
  deleteAt: string | null;

  // many to one
  @ManyToOne(() => User, (user) => user.cartsApproved, { nullable: true })
  approvalEmployee: User | null;

  // Cart Description
  @OneToMany(() => CartDescription, (cartDescription) => cartDescription.cart, {
    nullable: true,
  })
  cartDescriptions: CartDescription[] | null;
}
