import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ObjectiveMaster } from './objective-master.entity';
import { Rules } from './rules.entity';
import { Schedule } from './schedule.entity';
import { TemplateMaster } from './templateMaster.entity';
import { BaseEntity } from 'src/utils/entitites/base.entity';
import { UserLoginDetail } from 'src/user/entities/userLogin.entity';

@Entity('campaignDetails')
export class CampaignDetails extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  campName: string;

  @Column({ type: 'varchar', length: 255 })
  senderName: string;

  @Column({ type: 'varchar', length: 255 })
  senderEmail: string;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => ObjectiveMaster, (objective) => objective.id, { nullable: true })
  objective: ObjectiveMaster;

  @ManyToOne(() => TemplateMaster, (template) => template.id, { nullable: true })
  template: TemplateMaster;

  @ManyToOne(() => Rules, (rule) => rule.id, { nullable: true })
  rule: Rules;

  @ManyToOne(() => Schedule, (schedule) => schedule.id, { nullable: true })
  Schedule: Schedule;

  @ManyToOne(() => UserLoginDetail, (login) => login.id, { nullable: true })
  @JoinColumn({ name: 'userId' })
  login: UserLoginDetail;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: 'draft' | 'schedule' | 'send';

  @Column({ type: 'int', nullable: true })
  step: number;

  @Column({ type: 'text', nullable: true })
  selectedTemplateHtml: string;

  @Column('text', { array: true, nullable: true })
  selectedAudienceIds: string[];

  @Column({ type: 'varchar', nullable: true })
  deliveryMethod: string;

  @Column({ type: 'varchar', nullable: true })
  selectedTimeZone: string;

  @Column({ type: 'json', nullable: true })
  targetRules: any;

  @Column({ type: 'json', nullable: true })
  formData: any;
}
