import { BaseEntity } from "src/utils/entitites/base.entity";
import {  Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ObjectiveMaster } from "./objective-master.entity";

@Entity('templateMaster')
export class TemplateMaster extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  template: string;

  
  @Column({ type:'boolean',default:true})
  isActive:boolean;

  @ManyToOne(()=>ObjectiveMaster,object=>object.id)
  @JoinColumn({name:'objectiveId'})
  obj:ObjectiveMaster
}