import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn , ManyToMany, JoinTable} from 'typeorm';
import { Staff, ProductDetail } from './index';
import { PurchaseOrderDetail } from './index';

@Entity()
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  OrderID: number;

  @Column()
  OrderDate: string;

  @Column()
  StaffID: number;
    
  @Column({ nullable: false })
  isActive: boolean | null;

  // @Column({ type: 'decimal', precision: 10, scale: 2 })
  // totalPurchasePrice: number;

  @ManyToOne(() => Staff, (staff: any) => staff.purchaseOrders)
  @JoinColumn({ name: 'StaffID' })
  staff: Staff;

  @OneToMany(() => PurchaseOrderDetail, (pod) => pod.purchaseOrder)
  purchaseOrderDetails: PurchaseOrderDetail[];
}
