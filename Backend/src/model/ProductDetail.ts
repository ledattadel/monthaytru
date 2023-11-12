import { Entity, PrimaryGeneratedColumn, Column, ManyToOne ,JoinColumn, OneToMany} from 'typeorm';
import { Product } from './index';
import { Supplier } from './index';
import { PQProductDetail , PurchaseOrderDetail} from './index';

@Entity()
export class ProductDetail {
  @PrimaryGeneratedColumn()
  ProductDetailID: number;

  @Column()
  ProductID: number;

  @Column()
  SupplierID: number;

  @Column()
  SellingPrice: number;

  @Column()
  PurchasePrice: number;

    
  @Column({ nullable: false })
  isActive: boolean | null;

  // @Column({ nullable: false })
  // isPending: boolean | null;


  @Column()
  Quantity: number;

  @ManyToOne(() => Product, (product) => product.productDetails)
  @JoinColumn({ name: 'ProductID' })
  product: Product;

  @ManyToOne(() => Supplier, (supplier) => supplier.productDetails)
  @JoinColumn({ name: 'SupplierID' })
  supplier: Supplier;


  @OneToMany(() => PurchaseOrderDetail, (pod) => pod.purchaseOrder)
  purchaseOrderDetails: PurchaseOrderDetail[];

  @ManyToOne(() => PQProductDetail, (pqpd) => pqpd.productDetail)
  priceQuoteProductDetail: PQProductDetail;
}
