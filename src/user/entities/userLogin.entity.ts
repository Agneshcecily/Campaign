import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "src/utils/entitites/base.entity";
import { Otp } from "./otp.entity";



@Entity('user_login_detail')
export class UserLoginDetail extends BaseEntity {

      @PrimaryGeneratedColumn('uuid')
      id:string;

      @Column()
      emailId:string;

      @Column()
      password:string;

      @Column()
      isVerified:boolean;

      @Column()
      attemptCount:number;

      @ManyToOne(()=>Otp,otp=>otp.id,{eager:true})
      @JoinColumn({name:'otpId'})
      otpId:Otp;

 


}
