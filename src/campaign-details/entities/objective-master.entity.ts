import { BaseEntity } from "src/utils/entitites/base.entity";
import {  Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('objectiveMaster')
export class ObjectiveMaster extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type:'boolean',default:true})
  isActive:boolean;

}