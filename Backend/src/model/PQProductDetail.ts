import { Entity, Column, ManyToOne, JoinColumn ,PrimaryGeneratedColumn} from 'typeorm';
import { PriceQuote } from './index';
import { ProductDetail } from './index';

@Entity()
export class PQProductDetail {
  @PrimaryGeneratedColumn()
  PDID: number;
  
  @Column({ nullable: true })
  QuoteID: number;


  @Column()
  SellingPrice: number;

  @Column()
  PurchasePrice: number;


  @Column({ nullable: true })
  isAcceptedRepair: boolean;


  @Column()
  Quantity: number;

  @ManyToOne(() => PriceQuote, (pq) => pq.priceQuoteProductDetails)
  // @JoinColumn({ name: 'QuoteID' })
  priceQuote: PriceQuote;

  @ManyToOne(() => ProductDetail, (pd) => pd.priceQuoteProductDetail)
  // @JoinColumn({ name: 'PDID' })
  productDetail: ProductDetail;
}
