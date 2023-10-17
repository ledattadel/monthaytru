import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import {Product, Vehicle} from './index'
@Entity()
export class Brand {
  @PrimaryGeneratedColumn()
  BrandID: number;

  @Column()
  BrandName: string;

  @Column({ nullable: false })
  isActive: boolean | null


  @OneToMany(() => Vehicle, (vehicle) => vehicle.brand)
  vehicles: Vehicle[];

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];
}
