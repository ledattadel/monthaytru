import { Entity, PrimaryGeneratedColumn, Column, ManyToOne , JoinColumn} from 'typeorm';
import { PriceQuote } from './index';
import { Service } from './index';

@Entity()
export class PQServiceDetail {
  @PrimaryGeneratedColumn()
  PQSDID: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  Price: number;

  @Column()
  QuoteID: number;

  @Column()
  ServiceID: number;

  @ManyToOne(() => PriceQuote, (pq) => pq.priceQuoteServiceDetails)
  @JoinColumn({ name: 'QuoteID' })
  priceQuote: PriceQuote;

  @ManyToOne(() => Service, (service) => service.priceQuoteServiceDetails)
  @JoinColumn({ name: 'ServiceID' })
  service: Service;
}
