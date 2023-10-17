import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany ,JoinColumn, OneToOne} from 'typeorm';
import { Staff } from './index';
import { Receipt } from './index';
import { PQServiceDetail } from './index';
import { PQProductDetail } from './index';
import { RepairOrder } from './index';
import { Invoice } from './index';

@Entity()
export class PriceQuote {
  @PrimaryGeneratedColumn()
  QuoteID: number;

  @Column()
  Status: string;

  @Column()
  Time: Date;

  @Column()
  StaffID: number;

  @Column()
  ReceiptID: number;

  @ManyToOne(() => Staff, (staff: any) => staff.priceQuotes)
  @JoinColumn({ name: 'StaffID' })
  staff: Staff;

  @ManyToOne(() => Receipt, (receipt: any) => receipt.priceQuotes)
  @JoinColumn({ name: 'ReceiptID' })
  receipt: Receipt;

  @OneToMany(() => PQServiceDetail, (pqsd) => pqsd.priceQuote)
  priceQuoteServiceDetails: PQServiceDetail[];

  @OneToMany(() => PQProductDetail, (pqpd) => pqpd.priceQuote)
  priceQuoteProductDetails: PQProductDetail[];

  @OneToOne(() => RepairOrder, (ro) => ro.priceQuote)
  repairOrder: RepairOrder;

  @OneToOne(() => Invoice, (invoice) => invoice.priceQuote)
  invoice: Invoice;
}
