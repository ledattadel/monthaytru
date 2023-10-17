import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductDetail } from './ProductDetail';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  SupplierID: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  phoneNumber: string;

  
  @Column({ nullable: true })
  address: string;
  
  @Column({ nullable: false })
  isActive: boolean | null;


  @OneToMany(() => ProductDetail, (productDetail) => productDetail.supplier)
  productDetails: ProductDetail[];
}
