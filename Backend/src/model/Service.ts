import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PQServiceDetail } from './index';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  ServiceID: number;

  @Column()
  ServiceName: string;

  @Column({ type: 'text' })
  Description: string;

    
  @Column({ nullable: false })
  isActive: boolean | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  Price: number;

  @OneToMany(() => PQServiceDetail, (pqsd : any) => pqsd.service)
  priceQuoteServiceDetails: PQServiceDetail[];
}
