import { Entity, Column, ManyToOne, JoinColumn,PrimaryGeneratedColumn } from 'typeorm';
import { PurchaseOrder } from './index';
import { ProductDetail } from './index';
import { truncate } from 'fs';

@Entity()
export class PurchaseOrderDetail {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column()
  OrderId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  PurchasePrice: number;

  @Column({ nullable: false })
  isActive: boolean | null;

  @Column()
  Quantity: number;

  @ManyToOne(() => PurchaseOrder, (po) => po.purchaseOrderDetails)
  @JoinColumn({name:'OrderId'})
  purchaseOrder: PurchaseOrder;

  @ManyToOne(() => ProductDetail, (pd: any) => pd.purchaseOrderDetails)
  productDetail: ProductDetail;
}
