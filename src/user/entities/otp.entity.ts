import { BaseEntity } from "src/utils/entitites/base.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('otp')
export class Otp extends BaseEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    otp:number;

}