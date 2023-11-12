import { Entity, PrimaryGeneratedColumn, Column, ManyToOne , JoinColumn,OneToMany} from 'typeorm';
import { PriceQuote , RepairOrderDetail} from './index';
import { Service } from './index';

@Entity()
export class PQServiceDetail {
  @PrimaryGeneratedColumn()
  PQSDID: number;

  @Column()
  Price: number;

  @Column({ nullable: true })
  isAcceptedRepair: boolean;


  @Column({ nullable: true })
  QuoteID: number;

  @Column()
  ServiceID: number;

  @ManyToOne(() => PriceQuote, (pq) => pq.priceQuoteServiceDetails)
  // @JoinColumn({ name: 'QuoteID' })
  priceQuote: PriceQuote;


  @OneToMany(() => RepairOrderDetail, (rod) => rod.pqServiceDetail)
  repairOrderDetails: RepairOrderDetail[];

  @ManyToOne(() => Service, (service) => service.priceQuoteServiceDetails)
  @JoinColumn({ name: 'ServiceID' })
  service: Service;
}
