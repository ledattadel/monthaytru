import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import {
  AccessoryType,
  CartDescription,
  Comment,
  ImageUpload,
  Manufacturer,
  ProductDescription,
  ProductType,
  SaleDescription,
  ServiceType,
} from './index';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: () => '0' })
  quantity: number;

  @Column({ default: () => '0' })
  price: string;

  @Column('timestamp', { name: 'delete_at', nullable: true })
  deleteAt: string | null;

  @OneToOne(() => ImageUpload, (imageUpload) => imageUpload.product, {
    nullable: true,
  })
  @JoinColumn()
  image: ImageUpload | null;

  @ManyToOne(() => ProductType, (productType) => productType.products)
  productType: ProductType;

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.products, {
    nullable: true,
  })
  manufacturer: Manufacturer | null;

  @ManyToOne(() => AccessoryType, (accessoryType) => accessoryType.products, {
    nullable: true,
  })
  accessoryType: AccessoryType | null;

  @ManyToOne(() => ServiceType, (serviceType) => serviceType.products, {
    nullable: true,
  })
  serviceType: ServiceType | null;

  //Sale description
  @OneToMany(
    () => SaleDescription,
    (saleDescription) => saleDescription.product,
    {
      nullable: true,
    }
  )
  saleDescriptions: SaleDescription[] | null;

  // Cart Description
  @OneToMany(
    () => CartDescription,
    (cartDescription) => cartDescription.product,
    {
      nullable: true,
    }
  )
  cartDescriptions: CartDescription[] | null;

  //Product Description
  @OneToMany(
    () => ProductDescription,
    (productDescription) => productDescription.product,
    {
      nullable: true,
    }
  )
  productDescriptions: ProductDescription[] | null;

  // Comment
  @OneToMany(() => Comment, (comment) => comment.product, { nullable: true })
  comments: Comment[] | null;
}
