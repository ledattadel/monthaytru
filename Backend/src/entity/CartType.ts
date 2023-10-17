import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CartDescription } from './index';

@Entity()
export class CartType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  //@OneToMany(
  //  () => CartDescription,
  //  (cartDescription) => cartDescription.cartType
  //)
  //cartDescriptions: CartDescription[];
}
