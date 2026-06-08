import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TimeZoneMaster } from "./timeZone-master.entity";
import { BaseEntity } from "src/utils/entitites/base.entity";

@Entity('schedule')
export class Schedule extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  to: string;

  @Column({ type: 'varchar', nullable: false })
  subject: string;

  @Column({ type: 'text', nullable: false })
  html: string;

  @Column({ type: 'timestamptz', nullable: false })
  scheduledAt: Date;

  @Column({ type: 'varchar', nullable: false })
  timeZone: string;

  @Column({ type: 'boolean', default: false })
  isSent: boolean;

  @ManyToOne(() => TimeZoneMaster, (timeZoneMaster) => timeZoneMaster.schedules)
  timeZoneMaster: TimeZoneMaster;
}
