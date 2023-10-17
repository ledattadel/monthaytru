import { Entity, Column, ManyToOne, JoinColumn ,PrimaryGeneratedColumn} from 'typeorm';
import { PriceQuote } from './index';
import { ProductDetail } from './index';

@Entity()
export class PQProductDetail {
  @PrimaryGeneratedColumn()
  PDID: number;
  
  @Column()
  QuoteID: number;

  

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  SellingPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  PurchasePrice: number;

  @Column()
  Quantity: number;

  @ManyToOne(() => PriceQuote, (pq) => pq.priceQuoteProductDetails)
  @JoinColumn({ name: 'QuoteID' })
  priceQuote: PriceQuote;

  @ManyToOne(() => ProductDetail, (pd) => pd.priceQuoteProductDetail)
  @JoinColumn({ name: 'PDID' })
  productDetail: ProductDetail;
}
