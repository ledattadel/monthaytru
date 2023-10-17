import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne ,JoinColumn} from 'typeorm';
import { RepairOrder } from './index';
import { PQServiceDetail } from './index';
import { Staff } from './index';

@Entity()
export class RepairOrderDetail {
  @PrimaryGeneratedColumn()
  RODID: number;

  @Column()
  IsDone: boolean;

  @Column()
  TimeWhenDone: Date;

  @Column()
  RepairOrderID: number;

  @Column()
  PQSDID: number;

  @Column()
  StaffID: number;

  @OneToOne(() => RepairOrder, (ro: any) => ro.repairOrderDetail)
  @JoinColumn({ name: 'RepairOrderID' })
  repairOrder: RepairOrder;

  @ManyToOne(() => PQServiceDetail, (pqsd: any) => pqsd.repairOrderDetails)
  @JoinColumn({ name: 'PQSDID' })
  pqServiceDetail: PQServiceDetail;

  @ManyToOne(() => Staff, (staff) => staff.repairOrderDetails)
  @JoinColumn({ name: 'StaffID' })
  staff: Staff;
}
