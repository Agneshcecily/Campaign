import { BaseEntity } from "src/utils/entitites/base.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Schedule } from "./schedule.entity";

@Entity('timeZoneMaster')
export class TimeZoneMaster extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  timeZoneName: string;

  @OneToMany(() => Schedule, (schedule) => schedule.timeZoneMaster)
  schedules: Schedule[];
}
