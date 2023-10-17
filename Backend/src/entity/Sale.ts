import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany } from 'typeorm';
import { SaleDescription } from './index';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  startTime: string;

  @Column({ type: 'timestamp' })
  endTime: string;

  @Column()
  description: string;

	@OneToMany(() => SaleDescription, (saleDescription) => saleDescription.sale)
	saleDescriptions: SaleDescription[]
}
