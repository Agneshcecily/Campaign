import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,  } from "typeorm";
import { Subscriber } from "./subscriber.entity";
import { BaseEntity } from "src/utils/entitites/base.entity";


@Entity('subscriber_attribute')
export class SubscriberAttribute extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    key: string;

    @Column()
    value: string;

@ManyToOne(() => Subscriber, (sub) => sub.id)
@JoinColumn({name: 'subId'})
sub: Subscriber;

}




