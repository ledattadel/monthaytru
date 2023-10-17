import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
} from 'typeorm';
import { Product, ProductDescription, User } from './index';

@Entity()
export class ImageUpload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  filepath: string;

  @Column()
  mimetype: string;

  @Column({ type: 'bigint' })
  size: string;

  //User
  @OneToOne(() => User, (user) => user.avatar, { cascade: true })
  user: User;

  //Product
  @OneToOne(() => Product, (product) => product.image, { cascade: true })
  product: Product;
}
