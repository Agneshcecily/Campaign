import { BaseEntity } from "src/utils/entitites/base.entity";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
@Entity('source_master')
export class SourceMaster extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;
}