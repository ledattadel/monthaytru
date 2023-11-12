import { Entity, PrimaryGeneratedColumn, Column, OneToMany , ManyToOne, JoinColumn} from 'typeorm';
import { Receipt, Brand } from './index';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  VehicleID: number;

  @Column({ nullable: true })
  NumberPlate: string;


  @Column()
  TimeCreate: String;
  
  @Column({ nullable: true })
  Type: string;

  @Column({ nullable: true })
  Color: string;

  @Column({ nullable: true })
  EngineNumber: string;

  @Column({ nullable: true })
  ChassisNumber: string;



  @Column({ nullable: false })
  isActive: boolean | null;

  @Column({ nullable: true })
  BrandId: number; 


  @ManyToOne(() => Brand, (brand) => brand.vehicles)
  @JoinColumn({ name: 'BrandId' })
  brand: Brand;

  @OneToMany(() => Receipt, (receipt) => receipt.vehicle)
  receipts: Receipt[];
}

