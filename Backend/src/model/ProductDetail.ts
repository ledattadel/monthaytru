import { Entity, PrimaryGeneratedColumn, Column, ManyToOne ,JoinColumn} from 'typeorm';
import { Product } from './index';
import { Supplier } from './index';
import { PQProductDetail } from './index';

@Entity()
export class ProductDetail {
  @PrimaryGeneratedColumn()
  PDID: number;

  @Column()
  ProductID: number;

  @Column()
  SupplierID: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  SellingPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  PurchasePrice: number;

  @Column()
  Quantity: number;

  @ManyToOne(() => Product, (product) => product.productDetails)
  @JoinColumn({ name: 'ProductID' })
  product: Product;

  @ManyToOne(() => Supplier, (supplier) => supplier.productDetails)
  @JoinColumn({ name: 'SupplierID' })
  supplier: Supplier;

  @ManyToOne(() => PQProductDetail, (pqpd) => pqpd.productDetail)
  priceQuoteProductDetail: PQProductDetail;
}
