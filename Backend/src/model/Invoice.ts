import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn} from 'typeorm';
import { Staff } from './index';
import { PriceQuote } from './index';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  InvoiceID: number;

  @Column()
  Time: String;

  @Column()
  StaffID: number;


  @Column({ nullable: false})
  isActive: boolean | null;

  @Column()
  QuoteID: number;

  @OneToOne(() => PriceQuote, (pq) => pq.invoice)
  @JoinColumn({ name: 'QuoteID' })
  priceQuote: PriceQuote;

  @ManyToOne(() => Staff, (staff : any) => staff.invoices)
  @JoinColumn({ name: 'StaffID' })
  staff: Staff;
}
