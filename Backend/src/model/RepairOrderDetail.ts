import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne ,JoinColumn, OneToMany} from 'typeorm';
import { RepairOrder } from './index';
import { PQServiceDetail } from './index';
import { Staff } from './index';

@Entity()
export class RepairOrderDetail {
  @PrimaryGeneratedColumn()
  RODID: number;

  @Column()
  IsDone: boolean;

  @Column({ nullable: true})
  TimeWhenDone: string;

  @Column()
  RepairOrderID: number;

  @Column()
  StaffID: number;

  @ManyToOne(() => RepairOrder, (ro: any) => ro.repairOrderDetail)
  @JoinColumn({ name: 'RepairOrderID' })
  repairOrder: RepairOrder;

  @ManyToOne(() => PQServiceDetail, (pqsd) => pqsd.repairOrderDetails)
  pqServiceDetail: PQServiceDetail;


  @ManyToOne(() => Staff, (staff) => staff.repairOrderDetails)
  @JoinColumn({ name: 'StaffID' })
  staff: Staff;
}
