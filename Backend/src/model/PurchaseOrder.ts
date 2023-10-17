import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Staff } from './index';
import { PurchaseOrderDetail } from './index';

@Entity()
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  OrderID: number;

  @Column()
  OrderDate: Date;

  @Column()
  StaffID: number;

  @ManyToOne(() => Staff, (staff: any) => staff.purchaseOrders)
  @JoinColumn({ name: 'StaffID' })
  staff: Staff;

  @OneToMany(() => PurchaseOrderDetail, (pod) => pod.purchaseOrder)
  purchaseOrderDetails: PurchaseOrderDetail[];
}
