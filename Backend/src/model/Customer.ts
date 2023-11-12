import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Receipt } from './index';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  CustomerID: number;

  @Column()
  name: string;

  @Column()
  TimeCreate: String;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: false })
  phoneNumber: string;

  
  @Column({ nullable: false })
  isActive: boolean | null;

  @OneToMany(() => Receipt, (receipt) => receipt.customer)
  receipts: Receipt[];
}
