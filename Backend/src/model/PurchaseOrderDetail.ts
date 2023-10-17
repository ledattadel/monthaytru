import { Entity, Column, ManyToOne, JoinColumn,PrimaryGeneratedColumn } from 'typeorm';
import { PurchaseOrder } from './index';
import { ProductDetail } from './index';

@Entity()
export class PurchaseOrderDetail {
  @PrimaryGeneratedColumn()
  PDID: number;


  @Column()
  OrderID: number;


  @Column({ type: 'decimal', precision: 10, scale: 2 })
  PurchasePrice: number;

  @Column()
  Quantity: number;

  @ManyToOne(() => PurchaseOrder, (po) => po.purchaseOrderDetails)
  @JoinColumn({ name: 'OrderID' })
  purchaseOrder: PurchaseOrder;

  @ManyToOne(() => ProductDetail, (pd : any) => pd.purchaseOrderDetails)
  @JoinColumn({ name: 'PDID' })
  productDetail: ProductDetail;
}
