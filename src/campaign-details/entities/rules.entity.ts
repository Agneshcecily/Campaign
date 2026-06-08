import { BaseEntity } from "src/utils/entitites/base.entity";
import {  Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('rules')
export class Rules extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255})
  fieldName: string;

  @Column({ type: 'varchar', length: 255 })
  operator: string;

  @Column({ type: 'varchar', length: 255 })
  logic: string;
}