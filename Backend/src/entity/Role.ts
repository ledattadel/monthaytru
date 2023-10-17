import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from './index';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  roleId: number;

  @Column()
  roleName: string;

  @OneToMany(() => Account, (account) => account.role)
  accounts: Account[];
}
