import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
	JoinColumn,
} from 'typeorm';

import { PriceQuote, Receipt } from './index';
import { RepairOrderDetail } from './index';
import { Role } from  './index';
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');


@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  idCardNumber: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string | null;


  @Column({unique: true})
  username: string;

  @Column()
  password: string;

  @Column()
  RoleId: Number ;

  // account - role
  @ManyToOne(() => Role, (role) => role.staff)
  @JoinColumn({ name: 'RoleId' })
  role: Role;

  @Column({ nullable: false })
  isActive: boolean | null;

  @Column({ nullable: true })
  email: string | null;

  @Column({ nullable: true })
  phoneNumber: string | null;

  @Column('timestamp', { name: 'delete_at', nullable: true })
  deleteAt: Date | null;


  @OneToMany(() => Receipt, (receipt) => receipt.staff)
  receipts: Receipt[];

  @OneToMany(() => RepairOrderDetail, (rod) => rod.staff)
  repairOrderDetails: RepairOrderDetail[];
  

  
  @OneToMany(() => PriceQuote, (priceQuote) => priceQuote.staff)
  priceQuotes: PriceQuote[];



  @OneToMany(() => Receipt, (receipt) => receipt.editor)
  editedReceipts: Receipt[];

  @OneToMany(() => PriceQuote, (priceQuote) => priceQuote.editor)
  editPriceQuotes: PriceQuote[];



  
	comparePassword = (password: string) => {
		return bcrypt.compareSync(password, this.password)
	}

	createPassword = (password: string) => {
		return (this.password = bcrypt.hashSync(password, 10))
	}

	
}
