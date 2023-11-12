import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne , JoinColumn} from 'typeorm';
import { ProductDetail } from './index';
import {Brand} from './index'
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  ProductID: number;

  @Column()
  ProductName: string;

  @Column({ nullable: true, type: 'text' })
  ProductDescription: string;

  @Column()
  Price: number;
  
  @Column({ nullable: false })
  isActive: boolean | null;

  @Column({ nullable: true })
  BrandId: number; 
  
  @ManyToOne(() => Brand, (brand) => brand.products)
  @JoinColumn({ name: 'BrandId' })
  brand: Brand;

  @Column({ nullable: true })
  Unit: string;

  @OneToMany(() => ProductDetail, (productDetail) => productDetail.product)
  productDetails: ProductDetail[];
}
