import { map } from 'rxjs';
import {  Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Subscriber } from './subscriber.entity';
import { BaseEntity } from 'src/utils/entitites/base.entity';
import { CampaignDetails } from 'src/campaign-details/entities/campaign-detail.entity';

@Entity('subscriber_group')
export class SubscriberGroup extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  senderEmail: string;
  
  @ManyToOne(() => CampaignDetails, (camp) => camp.id)
  @JoinColumn({name: 'campaignId'})
  camp: CampaignDetails;


}

@Entity('mapping_entity')
export class MappingEntity extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: string;

@ManyToOne(() => SubscriberGroup, (group) => group.id)
@JoinColumn({name: 'groupId'})
group: SubscriberGroup;

@ManyToOne(() => Subscriber, (sub) => sub.id)
@JoinColumn({name: 'subId'})
sub: Subscriber;
}
