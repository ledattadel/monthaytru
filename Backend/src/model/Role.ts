import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import {  Staff } from './index';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  roleId: number;

  @Column()
  roleName: string;


  @OneToMany(() => Staff, (staff) => staff.role)
  staff: Staff[];
}
