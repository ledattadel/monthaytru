import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { PriceQuote } from './index';

@Entity()
export class RepairOrder {
  @PrimaryGeneratedColumn()
  RepairOrderID: number;

  @Column()
  IsDone: boolean;

  @Column()
  Time: Date;

  @Column()
  QuoteID: number;

  @OneToOne(() => PriceQuote, (pq) => pq.repairOrder)
  @JoinColumn({ name: 'QuoteID' })
  priceQuote: PriceQuote;
}
