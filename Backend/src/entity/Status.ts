import { PrimaryGeneratedColumn, Entity, Column, OneToMany } from 'typeorm';
import { Cart } from './index';

@Entity()
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

	@OneToMany(() => Cart, (cart) => cart.status)
  carts: Cart[];
}
